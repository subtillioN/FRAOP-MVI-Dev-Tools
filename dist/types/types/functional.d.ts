import { Option } from '../utils/option';
export type Func<A, B> = (a: A) => B;
export type Predicate<A> = Func<A, boolean>;
export type ValidationRule = {
    readonly name: string;
    readonly description: string;
    readonly validate: (code: string) => Option<string[]>;
};
export type ValidationResult = {
    readonly rule: string;
    readonly violations: string[];
};
export type Pattern = {
    readonly name: string;
    readonly description: string;
    readonly test: Predicate<string>;
};
