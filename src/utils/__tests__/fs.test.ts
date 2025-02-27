import { readFile, getAllFiles, moveFile, updateFile } from '../fs';
import { isSome } from '../option';
import fs from 'fs-extra';
import path from 'path';

// Mock the entire fs-extra module
jest.mock('fs-extra');

// Type the mocked fs module
const mockedFs = fs as jest.Mocked<typeof fs>;

// Create properly typed mock functions using two-step casting
const mockReadFile = (mockedFs.readFile as unknown) as jest.MockedFunction<(path: fs.PathLike | number, options?: { encoding?: BufferEncoding; flag?: string } | BufferEncoding | null) => Promise<string>>;
const mockStat = (mockedFs.stat as unknown) as jest.MockedFunction<(path: fs.PathLike, options?: fs.StatOptions | undefined) => Promise<fs.Stats>>;
const mockReaddir = (mockedFs.readdir as unknown) as jest.MockedFunction<(path: fs.PathLike, options?: { encoding?: BufferEncoding; withFileTypes?: false } | BufferEncoding | null) => Promise<string[]>>;
const mockEnsureDir = (mockedFs.ensureDir as unknown) as jest.MockedFunction<(path: string) => Promise<void>>;
const mockMove = (mockedFs.move as unknown) as jest.MockedFunction<(src: string, dest: string, options?: fs.MoveOptions) => Promise<void>>;
const mockWriteFile = (mockedFs.writeFile as unknown) as jest.MockedFunction<(path: string, data: string, options?: fs.WriteFileOptions) => Promise<void>>;

describe('Filesystem Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readFile', () => {
    it('should read file successfully', async () => {
      const mockContent = 'test content';
      const mockStats = {
        size: 100,
        mtime: new Date(),
        isDirectory: () => false
      } as fs.Stats;

      mockReadFile.mockResolvedValueOnce(mockContent);
      mockStat.mockResolvedValueOnce(mockStats);

      const result = await readFile('test.txt');
      expect(isSome(result)).toBe(true);
      if (isSome(result)) {
        expect(result.value.content).toBe(mockContent);
        expect(result.value.stats).toEqual(mockStats);
      }
    });

    it('should handle file read errors', async () => {
      mockReadFile.mockRejectedValueOnce(new Error('File not found'));

      const result = await readFile('nonexistent.txt');
      expect(isSome(result)).toBe(false);
    });
  });

  describe('getAllFiles', () => {
    it('should get all files recursively', async () => {
      const mockFiles = ['file1.ts', 'file2.tsx'];
      const mockDirs = ['dir1', 'dir2'];
      const mockStats = {
        isDirectory: () => false
      } as fs.Stats;
      const mockDirStats = {
        isDirectory: () => true
      } as fs.Stats;

      mockReaddir.mockResolvedValueOnce([...mockFiles, ...mockDirs]);
      mockReaddir.mockResolvedValueOnce([]);
      mockReaddir.mockResolvedValueOnce([]);

      mockStat.mockImplementation((filePath) => {
        return Promise.resolve(
          mockDirs.includes(path.basename(filePath.toString())) ? mockDirStats : mockStats
        );
      });

      const files = await getAllFiles('src');
      expect(files).toEqual(mockFiles.map(file => path.join('src', file)));
    });

    it('should exclude specified directories', async () => {
      const mockFiles = ['file1.ts'];
      const mockDirs = ['node_modules', '.git', 'dist', 'build'];
      const mockStats = {
        isDirectory: () => false
      } as fs.Stats;
      const mockDirStats = {
        isDirectory: () => true
      } as fs.Stats;

      mockReaddir.mockResolvedValueOnce([...mockFiles, ...mockDirs]);
      mockStat.mockImplementation((filePath) => {
        return Promise.resolve(
          mockDirs.includes(path.basename(filePath.toString())) ? mockDirStats : mockStats
        );
      });

      const files = await getAllFiles('src');
      expect(files).toEqual(mockFiles.map(file => path.join('src', file)));
    });
  });

  describe('moveFile', () => {
    it('should move file successfully', async () => {
      mockEnsureDir.mockResolvedValueOnce(undefined);
      mockMove.mockResolvedValueOnce(undefined);

      const result = await moveFile('source.txt', 'target.txt');
      expect(result).toBe(true);
      expect(mockEnsureDir).toHaveBeenCalledWith(path.dirname('target.txt'));
      expect(mockMove).toHaveBeenCalledWith('source.txt', 'target.txt', { overwrite: true });
    });

    it('should handle move errors', async () => {
      mockEnsureDir.mockRejectedValueOnce(new Error('Permission denied'));

      const result = await moveFile('source.txt', 'target.txt');
      expect(result).toBe(false);
    });
  });

  describe('updateFile', () => {
    it('should update file successfully', async () => {
      mockWriteFile.mockResolvedValueOnce(undefined);

      const result = await updateFile('test.txt', 'new content');
      expect(result).toBe(true);
      expect(mockWriteFile).toHaveBeenCalledWith('test.txt', 'new content', 'utf-8');
    });

    it('should handle update errors', async () => {
      mockWriteFile.mockRejectedValueOnce(new Error('Permission denied'));

      const result = await updateFile('test.txt', 'new content');
      expect(result).toBe(false);
    });
  });
}); 