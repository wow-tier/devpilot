import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface AgentContext {
  files: Record<string, string>;
  currentFile?: string;
  chatHistory: ChatMessage[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CodeModification {
  filePath: string;
  originalContent: string;
  modifiedContent: string;
  explanation: string;
}

export interface AgentResponse {
  message: string;
  modifications: CodeModification[];
  suggestedCommitMessage?: string;
  error?: string;
}

export class AIAgent {
  private context: AgentContext;

  constructor(context?: AgentContext) {
    this.context = context || {
      files: {},
      chatHistory: [],
    };
  }

  async processPrompt(
    userPrompt: string,
    files: Record<string, string> = {}
  ): Promise<AgentResponse> {
    try {
      // Add user message to history
      this.context.chatHistory.push({
        role: 'user',
        content: userPrompt,
      });

      // Build context for AI
      const systemPrompt = this.buildSystemPrompt(files);
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...this.context.chatHistory.slice(-10), // Keep last 10 messages for context
      ];

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const aiResponse = response.choices[0]?.message?.content || '';
      
      // Add AI response to history
      this.context.chatHistory.push({
        role: 'assistant',
        content: aiResponse,
      });

      // Parse AI response to extract modifications
      const modifications = this.parseModifications(aiResponse, files);
      const suggestedCommitMessage = this.extractCommitMessage(aiResponse);

      return {
        message: aiResponse,
        modifications,
        suggestedCommitMessage,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('AI Agent error:', error);
      return {
        message: 'I encountered an error processing your request.',
        modifications: [],
        error: errorMessage,
      };
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
