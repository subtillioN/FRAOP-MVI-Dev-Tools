import fs from 'fs-extra';
import path from 'path';
import { validateCode } from '../aspects/functional';
// Colors for output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';
async function validateDirectory(dir) {
    const files = await fs.readdir(dir);
    let hasViolations = false;
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
                hasViolations = await validateDirectory(filePath) || hasViolations;
            }
        }
        else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const violations = validateCode(content);
                if (violations.length > 0) {
                    console.log(`\n${YELLOW}Functional violations in ${filePath}:${NC}`);
                    violations.forEach(v => {
                        console.log(`${RED}[${v.rule}] - ${v.violations.join('\n  ')}${NC}`);
                    });
                    hasViolations = true;
                }
            }
            catch (error) {
                console.error(`${RED}Error analyzing ${filePath}:${NC}`, error);
            }
        }
    }
    return hasViolations;
}
async function validateFunctional(targetDir = 'src') {
    console.log(`${YELLOW}Checking functional programming principles...${NC}`);
    try {
        const hasViolations = await validateDirectory(targetDir);
        if (hasViolations) {
            console.log(`\n${RED}✖ Functional programming violations found${NC}`);
            process.exit(1);
        }
        else {
            console.log(`\n${GREEN}✓ No functional programming violations found${NC}`);
            process.exit(0);
        }
    }
    catch (error) {
        console.error(`${RED}Error running validation:${NC}`, error);
        process.exit(1);
    }
}
export default validateFunctional;
//# sourceMappingURL=validate-functional.js.map