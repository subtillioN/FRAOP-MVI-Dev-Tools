import { validateModuleBoundaries, analyzeFile, MODULES } from '../module-boundaries';
import { isSome } from '../../utils/option';
import { readFile } from '../../utils/fs';

jest.mock('../../utils/fs', () => ({
  readFile: jest.fn(),
  getAllFiles: jest.fn()
}));

describe('Module Boundaries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeFile', () => {
    it('should analyze file with dev tools patterns', async () => {
      const mockContent = `
        import { validateCode } from '../core/validation';
        import { readFile } from '../utils/fs';

        // This is a dev tools file
        export const devToolsFunction = () => {};
      `;

      (readFile as jest.Mock).mockResolvedValue({
        value: {
          content: mockContent,
          path: 'src/tools/example.ts'
        }
      });

      const result = await analyzeFile('src/tools/example.ts');
      expect(isSome(result)).toBe(true);
      if (isSome(result)) {
        expect(result.value.module).toBe('TOOLS');
        expect(result.value.imports).toEqual([
          '../core/validation',
          '../utils/fs'
        ]);
        expect(result.value.exports).toEqual([]);
      }
    });

    it('should analyze file without dev tools patterns', async () => {
      const mockContent = `
        import React from 'react';
        import { useState } from 'react';

        // This is a regular component
        export const MyComponent = () => {};
      `;

      (readFile as jest.Mock).mockResolvedValue({
        value: {
          content: mockContent,
          path: 'src/components/MyComponent.tsx'
        }
      });

      const result = await analyzeFile('src/components/MyComponent.tsx');
      expect(isSome(result)).toBe(true);
      if (isSome(result)) {
        expect(result.value.module).toBe('');
        expect(result.value.imports).toEqual([
          'react',
          'react'
        ]);
        expect(result.value.exports).toEqual([]);
      }
    });

    it('should handle file read errors', async () => {
      (readFile as jest.Mock).mockResolvedValue(null);

      const result = await analyzeFile('nonexistent.ts');
      expect(isSome(result)).toBe(false);
    });
  });

  describe('validateModuleBoundaries', () => {
    it('should validate module boundaries in directory', async () => {
      const mockFiles = [
        'src/tools/example.ts',
        'src/components/MyComponent.tsx'
      ];

      const mockContents = {
        'src/tools/example.ts': `
          import { validateCode } from '../core/validation';
          import { readFile } from '../utils/fs';
          // This is a dev tools file
          export const devToolsFunction = () => {};
        `,
        'src/components/MyComponent.tsx': `
          import React from 'react';
          import { useState } from 'react';
          // This is a regular component
          export const MyComponent = () => {};
        `
      };

      (readFile as jest.Mock).mockImplementation((path) => ({
        value: {
          content: mockContents[path],
          path
        }
      }));

      const results = await validateModuleBoundaries('src');
      expect(results.length).toBe(2);
      expect(results[0].module).toBe('TOOLS');
      expect(results[1].module).toBe('');
    });
  });
}); 