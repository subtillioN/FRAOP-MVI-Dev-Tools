import { spawn, ChildProcess } from 'child_process';
import chokidar, { FSWatcher } from 'chokidar';

// Colors for output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const NC = '\x1b[0m';

// Debounce function
const debounce = <T extends (...args: any[]) => any>(fn: T, ms: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), ms);
  };
};

// State tracking
let typeCheckProcess: ChildProcess | null = null;
let testProcess: ChildProcess | null = null;
let modulesProcess: ChildProcess | null = null;
let functionalProcess: ChildProcess | null = null;

// Kill existing processes
const killProcesses = (): void => {
  [typeCheckProcess, testProcess, modulesProcess, functionalProcess].forEach(proc => {
    if (proc) {
      proc.kill();
    }
  });
};

// Run command and return process
const runCommand = (command: string, args: string[], options: any = {}): ChildProcess => {
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
const startWatchers = (): void => {
  console.log(`${BLUE}Starting TTSD watch mode...${NC}\n`);

  // TypeScript type checking in watch mode
  console.log(`${CYAN}Starting type checking...${NC}`);
  typeCheckProcess = runCommand('npm', ['run', 'typecheck', '--', '--watch']);

  // Jest tests in watch mode
  console.log(`${CYAN}Starting test runner...${NC}`);
  testProcess = runCommand('npm', ['run', 'test:watch']);

  // Watch for file changes
  const watcher: FSWatcher = chokidar.watch(['src/**/*', 'FRAOP-MVI-Dev-Tools/src/**/*'], {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  // Debounced validation checks
  const runValidations = debounce((filePath: string): void => {
    console.log(`\n${YELLOW}Running validations for${NC} ${filePath}`);
    
    // Module boundary check
    console.log(`\n${CYAN}Checking module boundaries...${NC}`);
    modulesProcess = runCommand('node', ['scripts/validate-module-boundaries.js', filePath]);
    
    // Functional programming check
    console.log(`\n${CYAN}Checking functional programming principles...${NC}`);
    functionalProcess = runCommand('node', ['scripts/validate-functional.js', filePath]);
  }, 500);

  // File change handlers
  watcher
    .on('add', (filePath: string) => {
      console.log(`${GREEN}File added:${NC} ${filePath}`);
      runValidations(filePath);
    })
    .on('change', (filePath: string) => {
      console.log(`${YELLOW}File changed:${NC} ${filePath}`);
      runValidations(filePath);
    })
    .on('unlink', (filePath: string) => {
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
const printInitialMessage = (): void => {
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
async function ttsdWatch(): Promise<void> {
  printInitialMessage();
  startWatchers();
}

export default ttsdWatch; 