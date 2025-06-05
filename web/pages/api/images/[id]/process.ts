import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';

const prisma = new PrismaClient();
const queue = new Queue('image_processing', {
  connection: { host: 'localhost', port: 6379 },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'POST') {
    const image = await prisma.image.findUnique({ where: { id: Number(id) } });
    if (image) {
      await queue.add('process_image', { imageId: image.id, filePath: image.filePath });
      res.status(200).json({ message: 'Processing enqueued' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
