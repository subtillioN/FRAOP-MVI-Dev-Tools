import fs from 'fs-extra';
import path from 'path';
import { FileInfo } from '../core/types';
import { Option, Some, None } from './option';

// Read file with error handling
export const readFile = async (filePath: string): Promise<Option<FileInfo>> => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    return Some({
      path: filePath,
      content,
      stats: {
        size: stats.size,
        mtime: stats.mtime
      }
    });
  } catch (error) {
    return None;
  }
};

// Get all files in directory recursively
export const getAllFiles = async (
  dir: string,
  extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']
): Promise<string[]> => {
  const files: string[] = [];

  const walk = async (currentPath: string): Promise<void> => {
    const items = await fs.readdir(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
          await walk(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  };

  await walk(dir);
  return files;
};

// Move file with directory creation
export const moveFile = async (source: string, target: string): Promise<boolean> => {
  try {
    await fs.ensureDir(path.dirname(target));
    await fs.move(source, target, { overwrite: true });
    return true;
  } catch (error) {
    return false;
  }
};

// Update file content
export const updateFile = async (filePath: string, content: string): Promise<boolean> => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    return false;
  }
}; 