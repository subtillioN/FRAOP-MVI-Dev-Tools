/// <reference types="node" />
import { EventEmitter } from 'events';
interface MonitoringOptions {
    sampleInterval?: number;
    warningThreshold?: number;
    errorThreshold?: number;
}
export declare class MonitoringService extends EventEmitter {
    private isMonitoring;
    private sampleInterval;
    private warningThreshold;
    private errorThreshold;
    private metrics;
    constructor(options?: MonitoringOptions);
    start(): void;
    stop(): void;
    private startMonitoring;
    private collectPerformanceMetrics;
    private checkViolations;
}
export {};
