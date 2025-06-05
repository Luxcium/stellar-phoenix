import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();

const worker = new Worker(
  'image_processing',
  async job => {
    const { imageId, filePath } = job.data;
    const thumbnailPath = filePath.replace(/\.(\w+)$/, '_thumbnail.$1');
    await sharp(filePath).resize(200, 200).toFile(thumbnailPath);
    await prisma.image.update({
      where: { id: imageId },
      data: { thumbnail: thumbnailPath, status: 'completed' },
    });
    console.log(`Processed ${filePath}`);
  },
  { connection: { host: 'localhost', port: 6379 } }
);

worker.on('completed', job => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.log(`Job ${job?.id} failed: ${err.message}`));
