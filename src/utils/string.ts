/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to camelCase.
 */
export function camelCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

/**
 * Converts a string to kebab-case.
 */
export function kebabCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to snake_case.
 */
export function snakeCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]/g, '_')
    .toLowerCase();
}

/**
 * Converts a string to PascalCase.
 */
export function pascalCase(str: string): string {
  if (!str) return str;
  return capitalize(camelCase(str));
}

/**
 * Checks if a string is all uppercase.
 */
export function isUpperCase(str: string): boolean {
  return str === str.toUpperCase();
}

/**
 * Checks if a string is all lowercase.
 */
export function isLowerCase(str: string): boolean {
  return str === str.toLowerCase();
} 