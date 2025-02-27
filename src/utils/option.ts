/**
 * Represents an optional value that may or may not be present.
 * This is a TypeScript implementation of the Option type pattern.
 */
export type Option<T> = Some<T> | None;

/**
 * Represents the presence of a value of type T.
 */
export interface Some<T> {
  readonly type: 'Some';
  readonly value: T;
}

/**
 * Represents the absence of a value.
 */
export interface None {
  readonly type: 'None';
}

/**
 * Creates a Some instance containing the given value.
 */
export function Some<T>(value: T): Some<T> {
  return { type: 'Some', value };
}

/**
 * Creates a None instance.
 */
export const None = { type: 'None' as const };

/**
 * Type guard to check if an Option is Some.
 */
export function isSome<T>(option: Option<T>): option is Some<T> {
  return option.type === 'Some';
}

/**
 * Type guard to check if an Option is None.
 */
export function isNone<T>(option: Option<T>): option is None {
  return option.type === 'None';
}

/**
 * Maps a function over an Option value.
 * If the Option is Some, applies the function to the contained value.
 * If the Option is None, returns None.
 */
export function map<T, U>(option: Option<T>, f: (value: T) => U): Option<U> {
  return isSome(option) ? Some(f(option.value)) : None;
}

/**
 * Maps a function that returns an Option over an Option value.
 * If the Option is Some, applies the function to the contained value.
 * If the Option is None, returns None.
 */
export function flatMap<T, U>(option: Option<T>, f: (value: T) => Option<U>): Option<U> {
  return isSome(option) ? f(option.value) : None;
}

/**
 * Returns the value contained in an Option if it is Some,
 * otherwise returns the provided default value.
 */
export function getOrElse<T>(option: Option<T>, defaultValue: T): T {
  return isSome(option) ? option.value : defaultValue;
}

// Conversion utilities
export const fromNullable = <T>(value: T | null | undefined): Option<T> =>
  value === null || value === undefined ? None : Some(value);

export const toNullable = <T>(option: Option<T>): T | null =>
  isSome(option) ? option.value : null; 