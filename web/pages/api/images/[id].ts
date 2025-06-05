import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'PUT') {
    const { alias, tags } = req.body;
    const image = await prisma.image.update({
      where: { id: Number(id) },
      data: { alias, tags },
    });
    res.status(200).json(image);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
