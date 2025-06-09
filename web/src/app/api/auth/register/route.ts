import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes, pbkdf2Sync } from 'crypto';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  try {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: `${salt}:${hash}`,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to create user' }, { status: 500 });
  }
}
