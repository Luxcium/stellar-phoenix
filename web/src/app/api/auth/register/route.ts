import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  try {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashPassword(password),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Unable to create user' }, { status: 500 });
  }
}
