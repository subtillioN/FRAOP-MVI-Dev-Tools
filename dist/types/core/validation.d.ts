import { ArchitecturalAnalysis } from '../types';
export declare class ArchitecturalValidator {
    private static instance;
    private constructor();
    static getInstance(): ArchitecturalValidator;
    validateLocation(path: string): boolean;
    validateDependency(from: string, to: string): boolean;
    validateIntegration(component: {
        type: string;
        path: string;
    }): boolean;
    analyze(path: string, dependencies: string[]): ArchitecturalAnalysis;
}
