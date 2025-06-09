import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pbkdf2Sync } from 'crypto';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const [salt, storedHash] = user.passwordHash.split(':');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  if (hash !== storedHash) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = await new SignJWT({ sub: user.id.toString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'secret'));
  const response = NextResponse.json({ ok: true });
  response.cookies.set('token', token, { httpOnly: true, path: '/' });
  return response;
}
