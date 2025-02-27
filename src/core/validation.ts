import { ArchitecturalAnalysis } from '../types';

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