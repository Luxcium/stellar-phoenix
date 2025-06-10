import { Result } from '@/types/core/Result';

describe('Result Type', () => {
  describe('Type Structure', () => {
    it('should have correct type structure for success case', () => {
      const success: Result<number> = { success: true, value: 42 };
      expect(success.success).toBe(true);
      if (success.success) {
        expect(success.value).toBe(42);
      }
      expect(success).toBeType('object');
    });

    it('should have correct type structure for failure case', () => {
      const error = new Error('test error');
      const failure: Result<number> = { success: false, error };
      expect(failure.success).toBe(false);
      if (!failure.success) {
        expect(failure.error).toBe(error);
      }
      expect(failure).toBeType('object');
    });
  });

  describe('Result.success', () => {
    it('should create a successful result', () => {
      const result = Result.success(42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(42);
      }
    });

    it('should work with different types', () => {
      const stringResult = Result.success('test');
      const arrayResult = Result.success([1, 2, 3]);
      const objectResult = Result.success({ key: 'value' });

      if (stringResult.success) {
        expect(stringResult.value).toBe('test');
      }
      if (arrayResult.success) {
        expect(arrayResult.value).toEqual([1, 2, 3]);
      }
      if (objectResult.success) {
        expect(objectResult.value).toEqual({ key: 'value' });
      }
    });
  });

  describe('Result.failure', () => {
    it('should create a failed result', () => {
      const error = new Error('test error');
      const result = Result.failure(error);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(error);
      }
    });

    it('should work with custom error types', () => {
      class CustomError {
        constructor(public message: string) {}
      }
      const customError = new CustomError('custom error');
      const result = Result.failure(customError);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customError);
      }
    });
  });

  describe('Result.try', () => {
    it('should return success for non-throwing function', () => {
      const result = Result.try(() => 42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(42);
      }
    });

    it('should return failure for throwing function', () => {
      const result = Result.try(() => {
        throw new Error('test error');
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('test error');
      }
    });

    it('should handle non-Error throws', () => {
      const result = Result.try(() => {
        throw 'string error';
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('string error');
      }
    });
  });
});
