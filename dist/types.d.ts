export interface PropUsage {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'unknown';
    usageCount: number;
    valueChanges: number;
    lastValue?: any;
    timestamps: number[];
}
export interface ComponentUsage {
    componentName: string;
    props: PropUsage[];
    renderCount: number;
    lastRenderTime: number;
    renderDurations: number[];
}
export type MonitoringEventType = 'update' | 'warning' | 'start' | 'stop';
export interface PerformanceMetrics {
    latencies: number[];
    errors: number;
    totalRequests: number;
    timestamps: number[];
    averageLatency?: number;
    errorRate?: number;
    throughput?: number;
}
