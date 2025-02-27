/// <reference types="node" />
import { EventEmitter } from 'events';
interface MonitoringOptions {
    sampleInterval?: number;
    warningThreshold?: number;
    errorThreshold?: number;
}
export declare class MonitoringService extends EventEmitter {
    private static instance;
    private isMonitoring;
    private sampleInterval;
    private warningThreshold;
    private errorThreshold;
    private metrics;
    private constructor();
    static getInstance(options?: MonitoringOptions): MonitoringService;
    start(): void;
    stop(): void;
    private startMonitoring;
    private collectPerformanceMetrics;
    private checkViolations;
}
export {};
