import { describe, expect, it } from '@jest/globals';
import { Result } from '@/types/core/Result';
import { validateType } from '@/types/utils';
import { z } from 'zod';

describe('Integration Tests', () => {
  describe('User Management Integration', () => {
    const userSchema = z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      email: z.string().email(),
    });

    function createUser(
      input: Omit<
        {
          id: string;
          name: string;
          email: string;
        },
        'id'
      >
    ): Result<{
      id: string;
      name: string;
      email: string;
    }> {
      const id = 'generated-uuid';
      const user = { id, ...input };

      try {
        validateType(userSchema, user);
        return Result.success(user);
      } catch (error) {
        if (error instanceof Error) {
          return Result.failure(error);
        }
        return Result.failure(new Error('Unknown error occurred'));
      }
    }

    it('should create a valid user', () => {
      const result = createUser({
        name: 'John Doe',
        email: 'john@example.com',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.name).toBe('John Doe');
        expect(result.value.email).toBe('john@example.com');
      }
    });

    it('should fail to create a user with invalid email', () => {
      const result = createUser({
        name: 'John Doe',
        email: 'invalid-email',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Order Management Integration', () => {
    const orderSchema = z.object({
      orderId: z.string().uuid(),
      userId: z.string().uuid(),
      amount: z.number().positive(),
    });

    function createOrder(
      input: Omit<
        {
          orderId: string;
          userId: string;
          amount: number;
        },
        'orderId'
      >
    ): Result<{
      orderId: string;
      userId: string;
      amount: number;
    }> {
      const orderId = 'generated-order-uuid';
      const order = { orderId, ...input };

      try {
        validateType(orderSchema, order);
        return Result.success(order);
      } catch (error) {
        if (error instanceof Error) {
          return Result.failure(error);
        }
        return Result.failure(new Error('Unknown error occurred'));
      }
    }

    it('should create a valid order', () => {
      const result = createOrder({
        userId: 'generated-user-uuid',
        amount: 100,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.userId).toBe('generated-user-uuid');
        expect(result.value.amount).toBe(100);
      }
    });

    it('should fail to create an order with negative amount', () => {
      const result = createOrder({
        userId: 'generated-user-uuid',
        amount: -100,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
      }
    });
  });
});
