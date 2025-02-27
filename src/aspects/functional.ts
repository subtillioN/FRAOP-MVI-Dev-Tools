import { Option, Some, None, isSome } from '../utils/option';
import { ValidationRule, ValidationResult, Pattern } from '../types/functional';

// Functional programming patterns
const patterns: Pattern[] = [
  {
    name: 'mutation',
    description: 'Avoid mutating state directly',
    test: (code: string): boolean => {
      const mutationPatterns = [
        /\.[a-zA-Z]+\s*=\s*/,
        /\+\+/,
        /--/,
        /\+=|-=|\*=|\/=/
      ];
      return mutationPatterns.some(pattern => pattern.test(code));
    }
  },
  {
    name: 'side-effect',
    description: 'Functions should be pure and have no side effects',
    test: (code: string): boolean => {
      const sideEffectPatterns = [
        /console\.(log|warn|error)/,
        /Math\.random/,
        /new Date\(\)/,
        /setTimeout|setInterval/
      ];
      return sideEffectPatterns.some(pattern => pattern.test(code));
    }
  },
  {
    name: 'mutable-state',
    description: 'Use immutable state management',
    test: (code: string): boolean => {
      const mutableStatePatterns = [
        /useState\(\)/,
        /this\.state\s*=/,
        /setState\(\{[^}]+\}\)/
      ];
      return mutableStatePatterns.some(pattern => pattern.test(code));
    }
  },
  {
    name: 'null-check',
    description: 'Use Option types instead of null/undefined',
    test: (code: string): boolean => {
      const nullPatterns = [
        /null/,
        /undefined/,
        /\?\./
      ];
      return nullPatterns.some(pattern => pattern.test(code));
    }
  }
];

// Validation rules
export const rules: ValidationRule[] = patterns.map(pattern => ({
  name: pattern.name,
  description: pattern.description,
  validate: (code: string): Option<string[]> => {
    const violations: string[] = [];
    if (pattern.test(code)) {
      violations.push(`Found ${pattern.name} violation: ${pattern.description}`);
    }
    return violations.length > 0 ? Some(violations) : None;
  }
}));

// Validation function
export const validateCode = (code: string): ValidationResult[] => {
  return rules
    .map(rule => {
      const result = rule.validate(code);
      return {
        rule: rule.name,
        violations: isSome(result) ? result.value : []
      };
    })
    .filter(result => result.violations.length > 0);
}; 