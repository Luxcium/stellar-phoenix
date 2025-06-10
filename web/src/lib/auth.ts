import { randomBytes, pbkdf2Sync } from 'crypto';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  const result = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return result === hash;
}
