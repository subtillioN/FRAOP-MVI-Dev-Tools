import { groupBy, unique, flatten, chunk, partition } from '../array';

describe('Array Utilities', () => {
  describe('groupBy', () => {
    it('should group objects by key', () => {
      const items = [
        { id: 1, type: 'A' },
        { id: 2, type: 'B' },
        { id: 3, type: 'A' },
        { id: 4, type: 'C' },
        { id: 5, type: 'B' }
      ];

      const result = groupBy(items, item => item.type);
      expect(result).toEqual({
        'A': [{ id: 1, type: 'A' }, { id: 3, type: 'A' }],
        'B': [{ id: 2, type: 'B' }, { id: 5, type: 'B' }],
        'C': [{ id: 4, type: 'C' }]
      });
    });

    it('should handle empty array', () => {
      const result = groupBy([], item => item);
      expect(result).toEqual({});
    });

    it('should handle custom key selector', () => {
      const items = [1, 2, 3, 4, 5];
      const result = groupBy(items, num => num % 2 === 0 ? 'even' : 'odd');
      expect(result).toEqual({
        'even': [2, 4],
        'odd': [1, 3, 5]
      });
    });
  });

  describe('unique', () => {
    it('should remove duplicates from primitive array', () => {
      const arr = [1, 2, 2, 3, 3, 3, 4, 5, 5];
      expect(unique(arr)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });

    it('should handle array with objects using key selector', () => {
      const items = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
        { id: 3, name: 'C' }
      ];
      expect(unique(items, item => item.id)).toEqual([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'C' }
      ]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      const arr = [1, [2, 3], [4, [5, 6]], 7];
      expect(flatten(arr)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should handle empty array', () => {
      expect(flatten([])).toEqual([]);
    });

    it('should handle array with no nesting', () => {
      const arr = [1, 2, 3, 4];
      expect(flatten(arr)).toEqual([1, 2, 3, 4]);
    });

    it('should handle deeply nested arrays', () => {
      const arr = [1, [2, [3, [4, [5]]]]];
      expect(flatten(arr)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      expect(chunk(arr, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it('should handle chunk size equal to array length', () => {
      const arr = [1, 2, 3];
      expect(chunk(arr, 3)).toEqual([[1, 2, 3]]);
    });

    it('should handle chunk size larger than array length', () => {
      const arr = [1, 2];
      expect(chunk(arr, 3)).toEqual([[1, 2]]);
    });
  });

  describe('partition', () => {
    it('should partition array based on predicate', () => {
      const arr = [1, 2, 3, 4, 5];
      const [evens, odds] = partition(arr, num => num % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3, 5]);
    });

    it('should handle empty array', () => {
      const [trueValues, falseValues] = partition([], () => true);
      expect(trueValues).toEqual([]);
      expect(falseValues).toEqual([]);
    });

    it('should handle array where all elements match predicate', () => {
      const arr = [2, 4, 6, 8];
      const [evens, odds] = partition(arr, num => num % 2 === 0);
      expect(evens).toEqual([2, 4, 6, 8]);
      expect(odds).toEqual([]);
    });

    it('should handle array where no elements match predicate', () => {
      const arr = [1, 3, 5, 7];
      const [evens, odds] = partition(arr, num => num % 2 === 0);
      expect(evens).toEqual([]);
      expect(odds).toEqual([1, 3, 5, 7]);
    });
  });
}); 