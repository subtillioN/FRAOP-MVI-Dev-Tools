import { spawn } from 'child_process';
import chokidar from 'chokidar';
// Colors for output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const NC = '\x1b[0m';
// Debounce function
const debounce = (fn, ms) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(null, args), ms);
    };
};
// State tracking
let typeCheckProcess = null;
let testProcess = null;
let modulesProcess = null;
let functionalProcess = null;
// Kill existing processes
const killProcesses = () => {
    [typeCheckProcess, testProcess, modulesProcess, functionalProcess].forEach(proc => {
        if (proc) {
            proc.kill();
        }
    });
};
// Run command and return process
const runCommand = (command, args, options = {}) => {
    const proc = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
    });
    proc.on('error', (error) => {
        console.error(`${RED}Error running ${command}:${NC}`, error);
    });
    return proc;
};
// Start watchers
const startWatchers = () => {
    console.log(`${BLUE}Starting TTSD watch mode...${NC}\n`);
    // TypeScript type checking in watch mode
    console.log(`${CYAN}Starting type checking...${NC}`);
    typeCheckProcess = runCommand('npm', ['run', 'typecheck', '--', '--watch']);
    // Jest tests in watch mode
    console.log(`${CYAN}Starting test runner...${NC}`);
    testProcess = runCommand('npm', ['run', 'test:watch']);
    // Watch for file changes
    const watcher = chokidar.watch(['src/**/*', 'FRAOP-MVI-Dev-Tools/src/**/*'], {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });
    // Debounced validation checks
    const runValidations = debounce((filePath) => {
        console.log(`\n${YELLOW}Running validations for${NC} ${filePath}`);
        // Module boundary check
        console.log(`\n${CYAN}Checking module boundaries...${NC}`);
        modulesProcess = runCommand('node', ['scripts/module-manager.js', filePath]);
        // Functional programming check
        console.log(`\n${CYAN}Checking functional programming principles...${NC}`);
        functionalProcess = runCommand('node', ['scripts/validate-functional.js', filePath]);
    }, 500);
    // File change handlers
    watcher
        .on('add', (filePath) => {
        console.log(`${GREEN}File added:${NC} ${filePath}`);
        runValidations(filePath);
    })
        .on('change', (filePath) => {
        console.log(`${YELLOW}File changed:${NC} ${filePath}`);
        runValidations(filePath);
    })
        .on('unlink', (filePath) => {
        console.log(`${RED}File removed:${NC} ${filePath}`);
        runValidations(filePath);
    });
    // Handle process termination
    process.on('SIGINT', () => {
        console.log(`\n${BLUE}Shutting down TTSD watch mode...${NC}`);
        killProcesses();
        watcher.close();
        process.exit(0);
    });
};
// Print initial message
const printInitialMessage = () => {
    console.log(`
${BLUE}╔════════════════════════════════════╗
║     TTSD Watch Mode Starting...     ║
╚════════════════════════════════════╝${NC}

${CYAN}Watching for:${NC}
- File changes (module boundaries)
- Functional programming violations
- Type errors (real-time)
- Test results (continuous)

${YELLOW}Press Ctrl+C to exit${NC}
`);
};
// Main function
async function ttsdWatch() {
    printInitialMessage();
    startWatchers();
}
export default ttsdWatch;
//# sourceMappingURL=ttsd-watch.js.map