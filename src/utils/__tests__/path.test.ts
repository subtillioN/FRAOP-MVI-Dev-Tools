import { isSubPath, normalizePath, getRelativePath, getCommonPath } from '../path';
import path from 'path';

describe('Path Utilities', () => {
  describe('normalizePath', () => {
    it('should normalize Windows-style paths', () => {
      expect(normalizePath('C:\\Users\\test\\file.txt')).toBe('C:/Users/test/file.txt');
    });

    it('should normalize Unix-style paths', () => {
      expect(normalizePath('/Users/test/file.txt')).toBe('/Users/test/file.txt');
    });

    it('should handle paths with multiple separators', () => {
      expect(normalizePath('path//to////file.txt')).toBe('path/to/file.txt');
    });

    it('should handle empty paths', () => {
      expect(normalizePath('')).toBe('');
    });
  });

  describe('isSubPath', () => {
    it('should identify direct child paths', () => {
      expect(isSubPath('/parent', '/parent/child')).toBe(true);
    });

    it('should identify nested child paths', () => {
      expect(isSubPath('/parent', '/parent/child/grandchild')).toBe(true);
    });

    it('should handle same paths', () => {
      expect(isSubPath('/parent', '/parent')).toBe(false);
    });

    it('should handle unrelated paths', () => {
      expect(isSubPath('/parent1', '/parent2')).toBe(false);
    });

    it('should handle partial matches', () => {
      expect(isSubPath('/parent', '/parent2/child')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(isSubPath('/Parent', '/parent/child')).toBe(false);
    });
  });

  describe('getRelativePath', () => {
    it('should get relative path between parent and child', () => {
      expect(getRelativePath('/parent/child', '/parent')).toBe('child');
    });

    it('should get relative path between deeply nested paths', () => {
      expect(getRelativePath('/parent/child/grandchild', '/parent')).toBe('child/grandchild');
    });

    it('should handle same paths', () => {
      expect(getRelativePath('/parent', '/parent')).toBe('');
    });

    it('should handle unrelated paths', () => {
      expect(getRelativePath('/parent2/child', '/parent1')).toBe('../parent2/child');
    });

    it('should handle paths with different depths', () => {
      expect(getRelativePath('/a/b/c', '/x/y')).toBe('../../a/b/c');
    });
  });

  describe('getCommonPath', () => {
    it('should find common path between parent and child', () => {
      expect(getCommonPath('/parent/child', '/parent')).toBe('/parent');
    });

    it('should find common path between siblings', () => {
      expect(getCommonPath('/parent/child1', '/parent/child2')).toBe('/parent');
    });

    it('should find common path between deeply nested paths', () => {
      expect(getCommonPath('/a/b/c/d', '/a/b/x/y')).toBe('/a/b');
    });

    it('should handle no common path', () => {
      expect(getCommonPath('/a/b/c', '/x/y/z')).toBe('');
    });

    it('should handle identical paths', () => {
      expect(getCommonPath('/a/b/c', '/a/b/c')).toBe('/a/b/c');
    });

    it('should handle root as common path', () => {
      expect(getCommonPath('/a/b/c', '/a/x/y')).toBe('/a');
    });
  });
}); 