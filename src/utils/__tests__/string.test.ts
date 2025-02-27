import { capitalize, camelCase, kebabCase, snakeCase, pascalCase, isUpperCase, isLowerCase } from '../string';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('camelCase', () => {
    it('should convert kebab-case', () => {
      expect(camelCase('hello-world')).toBe('helloWorld');
    });

    it('should convert snake_case', () => {
      expect(camelCase('hello_world')).toBe('helloWorld');
    });

    it('should convert PascalCase', () => {
      expect(camelCase('HelloWorld')).toBe('helloWorld');
    });

    it('should handle multiple delimiters', () => {
      expect(camelCase('hello-world_example')).toBe('helloWorldExample');
    });

    it('should handle empty string', () => {
      expect(camelCase('')).toBe('');
    });
  });

  describe('kebabCase', () => {
    it('should convert camelCase', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
    });

    it('should convert PascalCase', () => {
      expect(kebabCase('HelloWorld')).toBe('hello-world');
    });

    it('should convert snake_case', () => {
      expect(kebabCase('hello_world')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(kebabCase('')).toBe('');
    });
  });

  describe('snakeCase', () => {
    it('should convert camelCase', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
    });

    it('should convert PascalCase', () => {
      expect(snakeCase('HelloWorld')).toBe('hello_world');
    });

    it('should convert kebab-case', () => {
      expect(snakeCase('hello-world')).toBe('hello_world');
    });

    it('should handle empty string', () => {
      expect(snakeCase('')).toBe('');
    });
  });

  describe('pascalCase', () => {
    it('should convert camelCase', () => {
      expect(pascalCase('helloWorld')).toBe('HelloWorld');
    });

    it('should convert kebab-case', () => {
      expect(pascalCase('hello-world')).toBe('HelloWorld');
    });

    it('should convert snake_case', () => {
      expect(pascalCase('hello_world')).toBe('HelloWorld');
    });

    it('should handle empty string', () => {
      expect(pascalCase('')).toBe('');
    });
  });

  describe('isUpperCase', () => {
    it('should identify uppercase strings', () => {
      expect(isUpperCase('HELLO')).toBe(true);
    });

    it('should identify mixed case strings', () => {
      expect(isUpperCase('Hello')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isUpperCase('')).toBe(true);
    });

    it('should handle non-letter characters', () => {
      expect(isUpperCase('HELLO123')).toBe(true);
      expect(isUpperCase('HELLO!')).toBe(true);
    });
  });

  describe('isLowerCase', () => {
    it('should identify lowercase strings', () => {
      expect(isLowerCase('hello')).toBe(true);
    });

    it('should identify mixed case strings', () => {
      expect(isLowerCase('Hello')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isLowerCase('')).toBe(true);
    });

    it('should handle non-letter characters', () => {
      expect(isLowerCase('hello123')).toBe(true);
      expect(isLowerCase('hello!')).toBe(true);
    });
  });
}); 