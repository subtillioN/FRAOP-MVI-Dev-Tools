export class PerformanceBenchmark {
    constructor(budget = {}) {
        this.metrics = [];
        this.startTime = 0;
        this.budget = { ...PerformanceBenchmark.DEFAULT_BUDGET, ...budget };
    }
    startBenchmark() {
        this.startTime = performance.now();
        this.metrics = [];
    }
    async benchmark(analysis) {
        const metrics = this.measureAnalysis(analysis);
        this.metrics.push(metrics);
        return metrics;
    }
    async compareBenchmarks(analyses) {
        return Promise.all(analyses.map(analysis => this.benchmark(analysis)));
    }
    getResults(filter) {
        if (!filter)
            return this.metrics;
        return this.metrics.filter(m => {
            if (filter.minTime && m.analysisTime < filter.minTime)
                return false;
            if (filter.maxTime && m.analysisTime > filter.maxTime)
                return false;
            return true;
        });
    }
    clearResults() {
        this.metrics = [];
    }
    measureAnalysis(analysis) {
        const endTime = performance.now();
        const analysisTime = endTime - this.startTime;
        // Get memory usage if supported
        const memoryUsage = performance.memory?.usedJSHeapSize || 0;
        // Calculate metrics
        const componentCount = analysis.components.length;
        const propCount = analysis.components.reduce((sum, comp) => sum + comp.props.length, 0);
        const updateFrequency = analysis.components.reduce((sum, comp) => sum +
            comp.props.reduce((propSum, prop) => propSum + (prop.valueChanges || 0), 0), 0);
        const metrics = {
            analysisTime,
            memoryUsage,
            componentCount,
            propCount,
            updateFrequency,
        };
        this.metrics.push(metrics);
        return metrics;
    }
    checkBudget(metrics) {
        const violations = [];
        if (metrics.analysisTime > this.budget.maxAnalysisTime) {
            violations.push(`Analysis time (${metrics.analysisTime.toFixed(2)}ms) exceeds budget (${this.budget.maxAnalysisTime}ms)`);
        }
        if (metrics.memoryUsage > this.budget.maxMemoryUsage) {
            violations.push(`Memory usage (${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB) exceeds budget (${(this.budget.maxMemoryUsage / 1024 / 1024).toFixed(2)}MB)`);
        }
        const averageUpdateLatency = metrics.analysisTime / metrics.updateFrequency;
        if (averageUpdateLatency > this.budget.maxUpdateLatency) {
            violations.push(`Update latency (${averageUpdateLatency.toFixed(2)}ms) exceeds budget (${this.budget.maxUpdateLatency}ms)`);
        }
        return violations;
    }
    getAverageMetrics() {
        if (this.metrics.length === 0) {
            throw new Error('No metrics collected yet');
        }
        return {
            analysisTime: this.metrics.reduce((sum, m) => sum + m.analysisTime, 0) /
                this.metrics.length,
            memoryUsage: this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) /
                this.metrics.length,
            componentCount: this.metrics.reduce((sum, m) => sum + m.componentCount, 0) /
                this.metrics.length,
            propCount: this.metrics.reduce((sum, m) => sum + m.propCount, 0) /
                this.metrics.length,
            updateFrequency: this.metrics.reduce((sum, m) => sum + m.updateFrequency, 0) /
                this.metrics.length,
        };
    }
    generateReport() {
        const averageMetrics = this.getAverageMetrics();
        const violations = this.checkBudget(averageMetrics);
        const status = violations.length === 0 ? 'PASS' : 'FAIL';
        return `
Performance Benchmark Report
==========================
Status: ${status}

Metrics:
- Analysis Time: ${averageMetrics.analysisTime.toFixed(2)}ms
- Memory Usage: ${(averageMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
- Component Count: ${Math.round(averageMetrics.componentCount)}
- Prop Count: ${Math.round(averageMetrics.propCount)}
- Update Frequency: ${Math.round(averageMetrics.updateFrequency)} updates

Budget Violations:
${violations.length === 0 ? 'None' : violations.map(v => `- ${v}`).join('\n')}

Performance Budget:
- Max Analysis Time: ${this.budget.maxAnalysisTime}ms
- Max Memory Usage: ${(this.budget.maxMemoryUsage / 1024 / 1024).toFixed(2)}MB
- Max Update Latency: ${this.budget.maxUpdateLatency}ms
`;
    }
}
PerformanceBenchmark.DEFAULT_BUDGET = {
    maxAnalysisTime: 100, // milliseconds
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
    maxUpdateLatency: 16, // milliseconds (targeting 60fps)
};
// Create a singleton instance
export const performanceBenchmark = new PerformanceBenchmark();
//# sourceMappingURL=PerformanceBenchmark.js.map