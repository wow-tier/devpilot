// src/app/lib/ai.ts
import OpenAI from 'openai';
import { CodeModification, AgentResponse, ChatMessage } from '../types';
import { fileSystem } from './fileSystem';
import { gitManager } from './git';
import { getSystemApiKey } from './system-keys';

export interface AgentContext {
  files: Record<string, string>;
  currentFile?: string;
  chatHistory: ChatMessage[];
}

export class AIAgent {
  private context: AgentContext;

  constructor(context?: AgentContext) {
    this.context = context || {
      files: {},
      chatHistory: [],
    };
  }

  /** Main entry: process user prompt, get AI response, apply changes, commit & push */
  async processPrompt(
    userPrompt: string,
    files: Record<string, string> = {},
    provider: string = 'openai'
  ): Promise<AgentResponse> {
    try {
      // Fetch system API key for the selected provider
      const apiKey = await getSystemApiKey(provider as 'openai' | 'claude' | 'grok');
      
      if (!apiKey) {
        throw new Error(`No API key configured for provider: ${provider}. Please ask your administrator to add API keys in the admin panel.`);
      }

      // Initialize OpenAI client with fetched key
      const openai = new OpenAI({
        apiKey: apiKey,
      });

      // Add user message to history
      this.context.chatHistory.push({
        id: Date.now().toString(),
        role: 'user',
        content: userPrompt,
        timestamp: new Date(),
      });

      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(files);
      const messages: ChatMessage[] = [
        { id: 'system', role: 'assistant', content: systemPrompt, timestamp: new Date() },
        ...this.context.chatHistory.slice(-10), // last 10 messages
      ];

      let aiResponse = '';

      // Determine model based on provider
      let model = 'gpt-3.5-turbo';
      if (provider === 'openai') {
        model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      } else if (provider === 'claude') {
        model = 'claude-3-5-sonnet-20241022';
      } else if (provider === 'grok') {
        model = 'grok-beta';
      }

      console.log(`Using provider: ${provider}, model: ${model}`);

      // Chat API - works for OpenAI, Claude, and Grok with appropriate SDKs
      const response = await openai.chat.completions.create({
        model,
        messages: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })) as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 4000,
      });
      aiResponse = response.choices[0]?.message?.content || '';


      // Add AI response to history
      this.context.chatHistory.push({
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      });

      // Parse modifications and commit message
      const modifications = this.parseModifications(aiResponse, files);
      const suggestedCommitMessage = this.extractCommitMessage(aiResponse);

      // Apply modifications step by step
      for (const mod of modifications) {
        await this.applyModification(mod);
      }

      // Commit changes if there are modifications
      if (modifications.length > 0 && suggestedCommitMessage) {
        await gitManager.commit(suggestedCommitMessage);
      }

      // Push changes automatically
      if (modifications.length > 0) {
        await gitManager.push();
      }

      return {
        message: aiResponse,
        modifications,
        suggestedCommitMessage,
      };
    } catch (error: unknown) {
      console.error('AI Agent error:', error);
      
      let errorMessage = 'I encountered an error processing your request.';
      
      // Type guard for OpenAI API errors
      const isOpenAIError = (err: unknown): err is { status?: number; code?: string } => {
        return typeof err === 'object' && err !== null && ('status' in err || 'code' in err);
      };
      
      // Handle quota/rate limit errors
      if (isOpenAIError(error) && (error.status === 429 || error.code === 'insufficient_quota')) {
        errorMessage = '❌ API quota exceeded. The API key has run out of credits. Please contact your administrator to update the API key.';
      }
      // Handle authentication errors
      else if (isOpenAIError(error) && (error.status === 401 || error.code === 'invalid_api_key')) {
        errorMessage = '❌ Invalid API key. Please contact your administrator to update the API key in the admin panel.';
      }
      // Handle missing API key
      else if (error instanceof Error && error.message.includes('No API key configured')) {
        errorMessage = error.message;
      }
      // Generic error
      else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        message: errorMessage,
        modifications: [],
        error: errorMessage,
      };
    }
  }

  /** Apply a single file modification */
  private async applyModification(mod: CodeModification) {
    try {
      await fileSystem.writeFile(mod.filePath, mod.modifiedContent);
      console.log(`Applied modification: ${mod.filePath}`);
    } catch (error) {
      console.error(`Failed to apply modification for ${mod.filePath}:`, error);
      throw error;
    }
  }

  private buildSystemPrompt(files: Record<string, string>): string {
    const fileList = Object.keys(files).join(', ');
    const fileContents = Object.entries(files)
      .map(([path, content]) => `\n--- ${path} ---\n${content}`)
      .join('\n');

    return `You are an AI code development agent integrated into a web IDE.

Your role:
1. Analyze user requests and understand their intent
2. Review the provided code files
3. Suggest and explain code modifications
4. Provide a suggested git commit message

Available files: ${fileList}

${fileContents}

When responding:
1. Explain what changes you'll make and why
2. Provide the exact modified code using this format:
   FILE_MODIFICATION: <filepath>
   \`\`\`
   <complete modified file content>
   \`\`\`
3. Suggest a git commit message using: COMMIT_MESSAGE: <message>

Be concise, accurate, and ensure all code is production-ready.`;
  }

  private parseModifications(
    aiResponse: string,
    originalFiles: Record<string, string>
  ): CodeModification[] {
    const modifications: CodeModification[] = [];
    const fileModRegex = /FILE_MODIFICATION:\s*(.+?)\n```(?:\w+)?\n([\s\S]+?)\n```/g;

    let match;
    while ((match = fileModRegex.exec(aiResponse)) !== null) {
      const filePath = match[1].trim();
      const modifiedContent = match[2].trim();
      const originalContent = originalFiles[filePath] || '';

      modifications.push({
        filePath,
        originalContent,
        modifiedContent,
        explanation: `Modified ${filePath}`,
      });
    }

    return modifications;
  }

  private extractCommitMessage(aiResponse: string): string | undefined {
    const commitMsgRegex = /COMMIT_MESSAGE:\s*(.+)/;
    const match = aiResponse.match(commitMsgRegex);
    return match ? match[1].trim() : undefined;
  }

  updateContext(context: Partial<AgentContext>): void {
    this.context = { ...this.context, ...context };
  }

  getContext(): AgentContext {
    return this.context;
  }

  clearHistory(): void {
    this.context.chatHistory = [];
  }
}

// Export singleton instance
export const aiAgent = new AIAgent();
