import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';

const prisma = new PrismaClient();
const queue = new Queue('image_processing', {
  connection: { host: 'localhost', port: 6379 },
});

async function findImages(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return findImages(fullPath);
      if (/\.(jpg|jpeg|png|gif)$/i.test(entry.name)) return [fullPath];
      return [];
    })
  );
  return files.flat();
}

async function ingestImages(dirs: string[]) {
  for (const dir of dirs) {
    const images = await findImages(dir);
    for (const filePath of images) {
      const existing = await prisma.image.findUnique({ where: { filePath } });
      if (!existing) {
        const fileName = path.basename(filePath);
        const alias = path.basename(filePath, path.extname(filePath));
        const image = await prisma.image.create({
          data: { fileName, filePath, alias, tags: [] },
        });
        await queue.add('process_image', { imageId: image.id, filePath });
        console.log(`Ingested ${fileName}`);
      }
    }
  }
}

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error('Please provide at least one directory to scan');
  process.exit(1);
}

ingestImages(dirs)
  .then(() => console.log('Ingestion complete'))
  .catch(err => console.error(err))
  .finally(() => process.exit(0));
