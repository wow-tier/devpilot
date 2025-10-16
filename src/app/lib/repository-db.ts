import prisma from './db';

export async function getUserRepositories(userId: string) {
  return await prisma.repository.findMany({
    where: { userId },
    orderBy: { lastAccessedAt: 'desc' },
  });
}

export async function createRepository(
  userId: string,
  data: {
    name: string;
    url: string;
    branch?: string;
    description?: string;
  }
) {
  return await prisma.repository.create({
    data: {
      userId,
      name: data.name,
      url: data.url,
      defaultBranch: data.branch || 'main',
      description: data.description,
      lastAccessedAt: new Date(),
      isActive: true,
    },
  });
}

export async function updateRepository(id: string, userId: string, data: Partial<{
  name: string;
  url: string;
  defaultBranch: string;
  description: string;
  lastAccessedAt: Date;
}>) {
  return await prisma.repository.update({
    where: { id, userId },
    data,
  });
}

export async function deleteRepository(id: string, userId: string) {
  return await prisma.repository.delete({
    where: { id, userId },
  });
}

export async function getRepository(id: string, userId: string) {
  return await prisma.repository.findFirst({
    where: { id, userId },
  });
}

export async function updateLastAccessed(id: string, userId: string) {
  return await prisma.repository.update({
    where: { id, userId },
    data: { lastAccessedAt: new Date() },
  });
}
