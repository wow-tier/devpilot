import { NextRequest, NextResponse } from 'next/server';
import { fileSystem } from '@/app/lib/fileSystem';

// GET - List files in a directory
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const directory = searchParams.get('directory') || '.';
    const pattern = searchParams.get('pattern');

    if (pattern) {
      const files = await fileSystem.searchFiles(pattern, directory);
      return NextResponse.json({ success: true, files });
    }

    const files = await fileSystem.listFiles(directory);
    return NextResponse.json({ success: true, files });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// POST - Create or update a file
export async function POST(req: NextRequest) {
  try {
    const { filePath, content } = await req.json();

    if (!filePath || content === undefined) {
      return NextResponse.json(
        { error: 'filePath and content are required' },
        { status: 400 }
      );
    }

    await fileSystem.writeFile(filePath, content);
    
    return NextResponse.json({ 
      success: true, 
      message: `File ${filePath} created/updated successfully` 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a file
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get('filePath');

    if (!filePath) {
      return NextResponse.json(
        { error: 'filePath is required' },
        { status: 400 }
      );
    }

    await fileSystem.deleteFile(filePath);
    
    return NextResponse.json({ 
      success: true, 
      message: `File ${filePath} deleted successfully` 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
