/**
 * Jest setup file for the TFTDD project
 */

// Add custom matchers for type testing
expect.extend({
  toBeType(received: unknown, expected: string) {
    const type = typeof received;
    const pass = type === expected;
    return {
      pass,
      message: () =>
        `Expected value to be of type ${expected} but received type ${type}`,
    };
  },
  toBeValidResult(received: unknown) {
    const pass = received && typeof received === 'object' && 'success' in received;
    return {
      pass,
      message: () =>
        `Expected value to be a valid Result object but received ${typeof received}`,
    };
  },
  toMatchSchema(received: unknown, schema: any) {
    try {
      schema.parse(received);
      return {
        pass: true,
        message: () => `Expected value to match schema`,
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `Expected value to match schema but received error: ${error.message}`,
      };
    }
  },
});

// Custom type matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeType(expected: string): R;
      toBeValidResult(): R;
      toMatchSchema(schema: any): R;
    }
  }
}

export { };
