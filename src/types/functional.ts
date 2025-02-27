import { Option } from '../utils/option';

// Core functional types
export type Func<A, B> = (a: A) => B;
export type Predicate<A> = Func<A, boolean>;

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

// Pattern types
export type Pattern = {
  readonly name: string;
  readonly description: string;
  readonly test: Predicate<string>;
}; 