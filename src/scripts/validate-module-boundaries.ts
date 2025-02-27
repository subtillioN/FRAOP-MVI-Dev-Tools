import { validateModuleBoundaries } from '../core/module-boundaries';
import { ModuleAnalysis } from '../core/types';

// Colors for output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';

// Report violations
const reportViolations = (violations: ModuleAnalysis[]): number => {
  if (violations.length === 0) {
    console.log(`${GREEN}✓ No module boundary violations found${NC}`);
    return 0;
  }

  console.log(`${RED}× Module boundary violations found:${NC}\n`);

  violations.forEach(violation => {
    console.log(`${RED}Error:${NC} Module boundary violation`);
    console.log(`File: ${violation.file}`);
    console.log(`Module: ${violation.module}`);
    console.log(`Imports: ${violation.imports.join(', ')}`);
    console.log(`\n`);
  });

  return 1;
};

// Run validation
async function validateModuleBoundariesScript(directory: string = 'src'): Promise<void> {
  try {
    const violations = await validateModuleBoundaries(directory);
    process.exit(reportViolations(violations));
  } catch (error) {
    console.error(`${RED}Error running module boundary validation:${NC}`, error);
    process.exit(1);
  }
}

export default validateModuleBoundariesScript; 