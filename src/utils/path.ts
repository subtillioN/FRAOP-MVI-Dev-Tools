import path from 'path';

/**
 * Normalizes a file path by converting backslashes to forward slashes
 * and removing redundant separators.
 */
export function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/\/+/g, '/');
}

/**
 * Checks if a path is a subpath of another path.
 * @param parent The potential parent path
 * @param child The potential child path
 * @returns true if child is a subpath of parent, false otherwise
 */
export function isSubPath(parent: string, child: string): boolean {
  const normalizedParent = normalizePath(parent);
  const normalizedChild = normalizePath(child);
  
  if (normalizedParent === normalizedChild) {
    return false;
  }

  const relativePath = path.relative(normalizedParent, normalizedChild);
  return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}

/**
 * Gets the relative path from one path to another.
 * @param from The source path
 * @param to The target path
 * @returns The relative path from source to target
 */
export function getRelativePath(from: string, to: string): string {
  const normalizedFrom = normalizePath(from);
  const normalizedTo = normalizePath(to);
  
  if (normalizedFrom === normalizedTo) {
    return '';
  }

  return normalizePath(path.relative(normalizedTo, normalizedFrom));
}

/**
 * Finds the common path between two paths.
 * @param path1 The first path
 * @param path2 The second path
 * @returns The common path between the two paths
 */
export function getCommonPath(path1: string, path2: string): string {
  const normalizedPath1 = normalizePath(path1);
  const normalizedPath2 = normalizePath(path2);

  if (normalizedPath1 === normalizedPath2) {
    return normalizedPath1;
  }

  const parts1 = normalizedPath1.split('/');
  const parts2 = normalizedPath2.split('/');
  const commonParts: string[] = [];

  for (let i = 0; i < Math.min(parts1.length, parts2.length); i++) {
    if (parts1[i] === parts2[i]) {
      commonParts.push(parts1[i]);
    } else {
      break;
    }
  }

  return commonParts.join('/');
} 