/**
 * Represents a result that can be either successful with a value or failed with an error.
 * This is a fundamental type used throughout the application to handle operations that can fail.
 *
 * @template T The type of the successful value
 * @template E The type of the error, defaults to Error
 *
 * @example
 * ```typescript
 * function divide(a: number, b: number): Result<number, Error> {
 *   if (b === 0) {
 *     return { success: false, error: new Error("Division by zero") };
 *   }
 *   return { success: true, value: a / b };
 * }
 * ```
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Helper functions to create Result instances
 */
export const Result = {
  /**
   * Creates a successful Result with the given value
   *
   * @param value The success value
   * @returns A successful Result containing the value
   */
  success<T>(value: T): Result<T> {
    return { success: true, value };
  },

  /**
   * Creates a failed Result with the given error
   *
   * @param error The error value
   * @returns A failed Result containing the error
   */
  failure<E = Error>(error: E): Result<never, E> {
    return { success: false, error };
  },

  /**
   * Attempts to execute a function that might throw and wraps the result
   *
   * @param fn The function to execute
   * @returns A Result containing either the function's return value or the caught error
   */
  try<T>(fn: () => T): Result<T> {
    try {
      return Result.success(fn());
    } catch (error) {
      return Result.failure(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  },
};
