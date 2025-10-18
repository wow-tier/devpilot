import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkAdmin } from '@/app/lib/admin-auth';

const prisma = new PrismaClient();

// PUT - Update plan
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const data = await request.json();

    const plan = await prisma.plan.update({
      where: { id },
      data
    });

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

// DELETE - Delete plan
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

    await prisma.plan.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}
