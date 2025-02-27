/**
 * Metric Analysis and Visualization Helpers
 * These utilities help analyze and visualize performance metrics from stream tests.
 */
export interface MetricSummary {
    min: number;
    max: number;
    avg: number;
    p95: number;
    p99: number;
}
/**
 * Calculates a specific percentile from an array of values
 */
export declare function calculatePercentile(values: number[], percentile: number): number;
/**
 * Generates a comprehensive summary of numeric metrics
 */
export declare function summarizeMetrics(values: number[]): MetricSummary;
/**
 * Creates a moving average calculator with specified window size
 */
export declare function createMovingAverage(windowSize: number): (value: number) => number;
/**
 * Detects anomalies in a dataset using standard deviation
 */
export declare function detectAnomalies(values: number[], threshold?: number): number[];
/**
 * Formats metrics as a readable table string
 */
export declare function formatMetricTable(metrics: Record<string, number>): string;
/**
 * Creates an ASCII visualization of value distribution
 */
export declare function visualizeDistribution(values: number[], buckets?: number): string;
/**
 * Calculates throughput metrics over time windows
 */
export declare function calculateThroughput(timestamps: number[], windowSize?: number): number[];
/**
 * Calculates statistical moments (mean, variance, skewness, kurtosis)
 */
export declare function calculateStatisticalMoments(values: number[]): {
    mean: number;
    variance: number;
    skewness: number;
    kurtosis: number;
};
/**
 * Performs trend analysis using linear regression
 */
export declare function analyzeTrend(values: number[], timestamps: number[]): {
    slope: number;
    intercept: number;
    rSquared: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
};
/**
 * Performs change point detection using CUSUM algorithm
 */
export declare function detectChangePoints(values: number[], threshold?: number): number[];
/**
 * Performs seasonal decomposition using moving averages
 */
export declare function decomposeTimeSeries(values: number[], period: number): {
    trend: number[];
    seasonal: number[];
    residual: number[];
};
export declare function analyzeLatencyPatterns(latencies: number[], timestamps?: number[]): {
    patterns: string[];
    bottlenecks: number[];
    statistics?: {
        moments: ReturnType<typeof calculateStatisticalMoments>;
        trend?: ReturnType<typeof analyzeTrend>;
        changePoints: number[];
        seasonal?: ReturnType<typeof decomposeTimeSeries>;
    };
};
/**
 * Creates an ASCII time-series plot
 */
export declare function visualizeTimeSeries(values: number[], timestamps: number[], height?: number, width?: number): string;
/**
 * Visualizes the correlation between two metrics
 */
export declare function visualizeCorrelation(values1: number[], values2: number[], height?: number, width?: number): string;
/**
 * Generates a comprehensive performance report
 */
export declare function generatePerformanceReport(metrics: {
    latencies: number[];
    throughput: number[];
    errors: number;
    totalRequests: number;
    timestamps?: number[];
}): string;
