import { PropAnalysisResult } from './propAnalysis';
export interface PerformanceMetrics {
    analysisTime: number;
    memoryUsage: number;
    componentCount: number;
    propCount: number;
    updateFrequency: number;
}
export interface PerformanceBudget {
    maxAnalysisTime: number;
    maxMemoryUsage: number;
    maxUpdateLatency: number;
}
export declare class PerformanceBenchmark {
    private static readonly DEFAULT_BUDGET;
    private metrics;
    private startTime;
    private budget;
    constructor(budget?: Partial<PerformanceBudget>);
    startBenchmark(): void;
    measureAnalysis(analysis: PropAnalysisResult): PerformanceMetrics;
    checkBudget(metrics: PerformanceMetrics): string[];
    getAverageMetrics(): PerformanceMetrics;
    generateReport(): string;
}
export declare const performanceBenchmark: PerformanceBenchmark;
