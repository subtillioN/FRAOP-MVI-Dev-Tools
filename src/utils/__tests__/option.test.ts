import { Option, Some, None, isSome, isNone, map, flatMap, getOrElse } from '../option';

describe('Option Utilities', () => {
  describe('isSome and isNone', () => {
    it('should correctly identify Some values', () => {
      const someValue = Some(42);
      expect(isSome(someValue)).toBe(true);
      expect(isNone(someValue)).toBe(false);
    });

    it('should correctly identify None values', () => {
      const noneValue: Option<string> = None;
      expect(isNone(noneValue)).toBe(true);
      expect(isSome(noneValue)).toBe(false);
    });
  });

  describe('Some and None constructors', () => {
    it('should create Some values', () => {
      const value = Some(42);
      expect(isSome(value)).toBe(true);
      if (isSome(value)) {
        expect(value.value).toBe(42);
      }
    });

    it('should create None values', () => {
      const value: Option<number> = None;
      expect(isNone(value)).toBe(true);
    });
  });

  describe('map', () => {
    it('should transform Some values', () => {
      const value = Some(42);
      const result = map(value, (x: number) => x * 2);
      expect(isSome(result)).toBe(true);
      if (isSome(result)) {
        expect(result.value).toBe(84);
      }
    });

    it('should pass through None values', () => {
      const value: Option<number> = None;
      const result = map(value, (x: number) => x * 2);
      expect(isNone(result)).toBe(true);
    });

    it('should handle transformations that return different types', () => {
      const value = Some(42);
      const result = map(value, (x: number) => x.toString());
      expect(isSome(result)).toBe(true);
      if (isSome(result)) {
        expect(result.value).toBe('42');
      }
    });
  });

  describe('flatMap', () => {
    it('should chain Some values', () => {
      const value = Some(42);
      const result = flatMap(value, (x: number) => Some(x * 2));
      expect(isSome(result)).toBe(true);
      if (isSome(result)) {
        expect(result.value).toBe(84);
      }
    });

    it('should pass through None values', () => {
      const value: Option<number> = None;
      const result = flatMap(value, (x: number) => Some(x * 2));
      expect(isNone(result)).toBe(true);
    });

    it('should handle transformations that return None', () => {
      const value = Some(42);
      const result = flatMap(value, (_: number) => None);
      expect(isNone(result)).toBe(true);
    });

    it('should handle transformations that return different types', () => {
      const value = Some(42);
      const result = flatMap(value, (x: number) => Some(x.toString()));
      expect(isSome(result)).toBe(true);
      if (isSome(result)) {
        expect(result.value).toBe('42');
      }
    });
  });

  describe('getOrElse', () => {
    it('should return the value for Some', () => {
      const value = Some(42);
      expect(getOrElse(value, 0)).toBe(42);
    });

    it('should return the default value for None', () => {
      const value: Option<number> = None;
      expect(getOrElse(value, 0)).toBe(0);
    });

    it('should handle different types correctly', () => {
      const value: Option<string> = None;
      expect(getOrElse(value, 'default')).toBe('default');
    });
  });
}); 