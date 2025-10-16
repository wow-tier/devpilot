import { NextResponse } from 'next/server';
import { ValidationError } from './validation';

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

export class AppError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const handleApiError = (error: unknown): NextResponse<ErrorResponse> => {
  console.error('API Error:', error);

  // Validation errors
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Git errors
  if (error instanceof Error && error.message.includes('git')) {
    return NextResponse.json(
      {
        error: 'Git operation failed: ' + error.message,
        code: 'GIT_ERROR',
      },
      { status: 500 }
    );
  }

  // File system errors
  if (error instanceof Error && error.message.includes('ENOENT')) {
    return NextResponse.json(
      {
        error: 'File or directory not found',
        code: 'FILE_NOT_FOUND',
      },
      { status: 404 }
    );
  }

  if (error instanceof Error && error.message.includes('EACCES')) {
    return NextResponse.json(
      {
        error: 'Permission denied',
        code: 'PERMISSION_DENIED',
      },
      { status: 403 }
    );
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }

  // Unknown errors
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: error,
    },
    { status: 500 }
  );
};

// Wrapper for async API handlers
export const asyncHandler = (
  handler: (req: Request, ...args: unknown[]) => Promise<NextResponse>
) => {
  return async (req: Request, ...args: unknown[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
};
