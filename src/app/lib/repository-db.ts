import prisma from './db';

export async function getUserRepositories(userId: string) {
  return await prisma.repository.findMany({
    where: { userId },
    orderBy: { lastAccessed: 'desc' },
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
      branch: data.branch || 'main',
      description: data.description,
      lastAccessed: new Date(),
    },
  });
}

export async function updateRepository(id: string, userId: string, data: Partial<{
  name: string;
  url: string;
  branch: string;
  description: string;
  lastAccessed: Date;
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
    data: { lastAccessed: new Date() },
  });
}
