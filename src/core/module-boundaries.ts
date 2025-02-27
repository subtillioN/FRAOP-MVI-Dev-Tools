import { ModuleConfig, ModuleAnalysis } from './types';
import { Option, Some, None, isSome } from '../utils/option';
import { readFile, getAllFiles } from '../utils/fs';

// Module configurations
export const MODULES = {
  TOOLS: {
    name: 'FRAOP-MVI-Dev-Tools',
    patterns: [
      /dev-?tools/i,
      /devtools/i,
      /development.?tools/i,
      /debug.?tools/i
    ],
    targetDir: 'FRAOP-MVI-Dev-Tools/src',
    subdirs: {
      components: 'components',
      core: 'core',
      services: 'services',
      utils: 'utils',
      scripts: 'scripts'
    }
  }
} as const;

// Analyze file for module boundaries
export const analyzeFile = async (filePath: string): Promise<Option<ModuleAnalysis>> => {
  const fileResult = await readFile(filePath);
  if (!isSome(fileResult)) return None;

  const { content } = fileResult.value;
  const imports = content.match(/import .* from ['"].*['"]/g) || [];
  const exports = content.match(/export .* from ['"].*['"]/g) || [];

  // Determine module based on patterns
  let module = '';
  for (const [key, config] of Object.entries(MODULES)) {
    if (config.patterns.some(pattern => pattern.test(content))) {
      module = key;
      break;
    }
  }

  return Some({
    module,
    file: filePath,
    content,
    imports: imports.map((imp: string) => imp.match(/from ['"](.*)['"]/)![1]),
    exports: exports.map((exp: string) => exp.match(/from ['"](.*)['"]/)![1])
  });
};

// Validate module boundaries
export const validateModuleBoundaries = async (directory: string): Promise<ModuleAnalysis[]> => {
  const files = await getAllFiles(directory);
  const analyses: ModuleAnalysis[] = [];

  for (const file of files) {
    const analysis = await analyzeFile(file);
    if (isSome(analysis)) {
      analyses.push(analysis.value);
    }
  }

  return analyses;
}; 