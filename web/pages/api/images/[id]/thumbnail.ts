import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const image = await prisma.image.findUnique({ where: { id: Number(id) } });
    if (image && image.thumbnail) {
      const filePath = path.resolve(image.thumbnail);
      const stat = fs.statSync(filePath);
      res.writeHead(200, {
        'Content-Type': 'image/jpeg', // Adjust dynamically if needed
        'Content-Length': stat.size,
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.status(404).send('Thumbnail not found');
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
