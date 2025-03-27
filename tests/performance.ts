import { performance } from 'perf_hooks';
import { Result } from '@/types/core/Result';

describe('Performance Tests', () => {
  it('should measure performance of Result.success', () => {
    const start = performance.now();
    for (let i = 0; i < 1000000; i++) {
      Result.success(i);
    }
    const end = performance.now();
    const duration = end - start;
    console.log(`Result.success performance: ${duration}ms`);
    expect(duration).toBeLessThan(1000);
  });

  it('should measure performance of Result.failure', () => {
    const start = performance.now();
    for (let i = 0; i < 1000000; i++) {
      Result.failure(new Error('test error'));
    }
    const end = performance.now();
    const duration = end - start;
    console.log(`Result.failure performance: ${duration}ms`);
    expect(duration).toBeLessThan(1000);
  });

  it('should measure performance of Result.try', () => {
    const start = performance.now();
    for (let i = 0; i < 1000000; i++) {
      Result.try(() => i);
    }
    const end = performance.now();
    const duration = end - start;
    console.log(`Result.try performance: ${duration}ms`);
    expect(duration).toBeLessThan(1000);
  });
});
