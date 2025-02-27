import { ArchitecturalAnalysis } from '../types';
import { Option, Some, None, isSome } from '../utils/option';
import { ValidationRule, ValidationResult } from './types';

export class ArchitecturalValidator {
  private static instance: ArchitecturalValidator;

  private constructor() {}

  static getInstance(): ArchitecturalValidator {
    if (!ArchitecturalValidator.instance) {
      ArchitecturalValidator.instance = new ArchitecturalValidator();
    }
    return ArchitecturalValidator.instance;
  }

  validateLocation(path: string): boolean {
    if (path.includes('dev-tools') || path.includes('devtools')) {
      if (!path.startsWith('FRAOP-MVI-Dev-Tools')) {
        throw new Error(
          'ARCHITECTURAL VIOLATION: Dev tools code MUST be in FRAOP-MVI-Dev-Tools module. ' +
          'This is a strict separation of concerns rule.'
        );
      }
    }
    return true;
  }

  validateDependency(from: string, to: string): boolean {
    // Main app can only depend on the public API of dev tools
    if (from.startsWith('imagN') && to.includes('dev-tools')) {
      if (!to.startsWith('FRAOP-MVI-Dev-Tools')) {
        throw new Error(
          'ARCHITECTURAL VIOLATION: Application can only depend on FRAOP-MVI-Dev-Tools public API. ' +
          'Direct dev tools implementations in the main app are forbidden.'
        );
      }
    }

    // Dev tools module cannot depend on main app
    if (from.startsWith('FRAOP-MVI-Dev-Tools') && to.startsWith('imagN')) {
      throw new Error(
        'ARCHITECTURAL VIOLATION: Dev tools module cannot depend on main application. ' +
        'This would create circular dependencies.'
      );
    }

    return true;
  }

  validateIntegration(component: { type: string; path: string }): boolean {
    if (component.type === 'dev-tools' && !component.path.startsWith('FRAOP-MVI-Dev-Tools')) {
      throw new Error(
        'ARCHITECTURAL VIOLATION: Dev tools components must be in FRAOP-MVI-Dev-Tools module. ' +
        'No exceptions to this rule are allowed.'
      );
    }
    return true;
  }

  analyze(path: string, dependencies: string[]): ArchitecturalAnalysis {
    const isDevToolsRelated = path.includes('dev-tools') || path.includes('devtools');
    const targetModule = path.startsWith('FRAOP-MVI-Dev-Tools') ? 'FRAOP-MVI-Dev-Tools' : 'imagN';
    
    const analysis: ArchitecturalAnalysis = {
      location: {
        isDevToolsRelated,
        targetModule,
        isValidLocation: this.validateLocation(path)
      },
      dependencies: {
        direction: targetModule === 'FRAOP-MVI-Dev-Tools' ? 'outward' : 'inward',
        isValidDependency: dependencies.every(dep => this.validateDependency(path, dep))
      },
      separation: {
        concernType: isDevToolsRelated ? 'development' : 'application',
        isProperSeparation: targetModule === (isDevToolsRelated ? 'FRAOP-MVI-Dev-Tools' : 'imagN')
      }
    };

    return analysis;
  }
}

// Validation patterns
export const patterns = {
  classKeyword: {
    pattern: /\bclass\b/,
    message: 'Avoid using classes. Use functional components and pure functions instead.',
  },
  thisKeyword: {
    pattern: /\bthis\b/,
    message: 'Avoid using "this" keyword. Use pure functions and closures instead.',
  },
  mutableOperations: {
    pattern: /\b(push|pop|shift|unshift|splice|sort|reverse)\b/,
    message: 'Avoid mutating operations. Use immutable operations instead.',
  },
  instanceOf: {
    pattern: /\binstanceof\b/,
    message: 'Avoid instanceof operator. Use type predicates or pattern matching instead.',
  },
  voidFunction: {
    pattern: /\bvoid\b/,
    message: 'Functions should return values for better composition.',
  },
  nullLiteral: {
    pattern: /\bnull\b/,
    message: 'Avoid null. Use Option/Maybe types for better null safety.',
  },
  letDeclaration: {
    pattern: /\blet\b/,
    message: 'Use const instead of let for better immutability.',
  },
  forLoop: {
    pattern: /\b(for|while)\b/,
    message: 'Use map/reduce/filter/etc. instead of loops for better functional style.',
  },
  deleteOperator: {
    pattern: /\bdelete\b/,
    message: 'Avoid delete operator. Create new objects instead of mutating existing ones.',
  },
  assignment: {
    pattern: /[^=!><]=[^=]/,
    message: 'Avoid assignments. Use immutable data structures and transformations.',
  },
} as const;

// Create validation rules
export const rules: ValidationRule[] = Object.entries(patterns).map(([name, { pattern, message }]) => ({
  name,
  description: message,
  validate: (code: string): Option<string[]> => {
    const violations: string[] = [];
    if (pattern.test(code)) {
      violations.push(`Found ${name} violation: ${message}`);
    }
    return violations.length > 0 ? Some(violations) : None;
  }
}));

// Validate code
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