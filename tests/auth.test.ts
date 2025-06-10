import { hashPassword, verifyPassword } from '../web/src/lib/auth';

describe('Auth utilities', () => {
  it('hashes and verifies password correctly', () => {
    const hashed = hashPassword('secret');
    expect(hashed.split(':').length).toBe(2);
    expect(verifyPassword('secret', hashed)).toBe(true);
    expect(verifyPassword('wrong', hashed)).toBe(false);
  });
});
