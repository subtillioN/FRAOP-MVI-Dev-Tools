import { Option } from '../utils/option';

// Core types
export type Func<A, B> = (a: A) => B;
export type Predicate<A> = Func<A, boolean>;

// File system types
export type FileInfo = {
  path: string;
  content: string;
  stats: {
    size: number;
    mtime: Date;
  };
};

// Validation types
export type ValidationRule = {
  readonly name: string;
  readonly description: string;
  readonly validate: (code: string) => Option<string[]>;
};

export type ValidationResult = {
  readonly rule: string;
  readonly violations: string[];
};

// Module types
export type ModuleConfig = {
  readonly name: string;
  readonly patterns: RegExp[];
  readonly targetDir: string;
  readonly subdirs: {
    readonly components: string;
    readonly core: string;
    readonly services: string;
    readonly utils: string;
    readonly scripts: string;
  };
};

export type ModuleAnalysis = {
  readonly module: string;
  readonly file: string;
  readonly content: string;
  readonly imports: string[];
  readonly exports: string[];
};

// Script types
export type ScriptOptions = {
  readonly cwd?: string;
  readonly watch?: boolean;
  readonly verbose?: boolean;
};

export type ScriptResult = {
  readonly success: boolean;
  readonly message: string;
  readonly data?: unknown;
}; 