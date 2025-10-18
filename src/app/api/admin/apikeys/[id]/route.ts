import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkAdmin } from '@/app/lib/admin-auth';

const prisma = new PrismaClient();

// DELETE - Delete API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    await prisma.apiKey.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
}
