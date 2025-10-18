import { NextRequest, NextResponse } from 'next/server';
import { aiAgent } from '@/app/lib/ai';
import { fileSystem } from '@/app/lib/fileSystem';

export async function POST(req: NextRequest) {
  try {
    const { prompt, filePaths } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Load specified files
    const files: Record<string, string> = {};
    if (filePaths && filePaths.length > 0) {
      for (const filePath of filePaths) {
        try {
          const fileContent = await fileSystem.readFile(filePath);
          files[filePath] = fileContent.content;
        } catch (error) {
          console.error(`Error reading file ${filePath}:`, error);
        }
      }
    }

    // Process prompt with AI agent
    const response = await aiAgent.processPrompt(prompt, files);

    return NextResponse.json({
      success: true,
      message: response.message,
      modifications: response.modifications,
      suggestedCommitMessage: response.suggestedCommitMessage,
      error: response.error,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in prompt API:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
