'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addDataSource(formData: FormData) {
  const alias = formData.get('alias')?.toString().trim();
  const path = formData.get('path')?.toString().trim();

  if (!alias || !path) {
    throw new Error('Alias and path are required');
  }

  try {
    await prisma.dataSource.create({
      data: {
        alias,
        path,
      },
    });
    revalidatePath('/data-sources');
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('This alias is already in use');
    }
    throw error;
  }
}

export async function getDataSources() {
  return prisma.dataSource.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function removeDataSource(id: string) {
  await prisma.dataSource.update({
    where: { id },
    data: { active: false },
  });
  revalidatePath('/data-sources');
}
