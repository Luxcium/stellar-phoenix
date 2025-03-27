/**
 * Utility functions for handling nested types, union types, and intersection types.
 */

/**
 * Deeply infers the type of a nested object.
 *
 * @template T The type of the nested object
 * @param obj The nested object
 * @returns The deeply inferred type of the object
 */
export function deepInfer<T>(obj: T): T {
  return obj;
}

/**
 * Combines multiple types into a union type.
 *
 * @template T The types to combine
 * @param types The types to combine
 * @returns The union type of the provided types
 */
export function combineUnion<T extends any[]>(...types: T): T[number] {
  return types[0];
}

/**
 * Combines multiple types into an intersection type.
 *
 * @template T The types to combine
 * @param types The types to combine
 * @returns The intersection type of the provided types
 */
export function combineIntersection<T extends any[]>(...types: T): T[0] & T[1] {
  return Object.assign({}, ...types);
}

/**
 * Validates a type using a Zod schema.
 *
 * @template T The type to validate
 * @param schema The Zod schema
 * @param value The value to validate
 * @returns The validation result
 */
export function validateType<T>(schema: any, value: any): T {
  return schema.parse(value);
}
