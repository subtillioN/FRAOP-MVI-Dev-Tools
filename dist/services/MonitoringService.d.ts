/// <reference types="node" />
import { EventEmitter } from 'events';
interface MonitoringOptions {
    sampleInterval?: number;
    warningThreshold?: number;
    errorThreshold?: number;
}
export interface MonitoringEvent {
    type: 'prop-update' | 'render' | 'error' | 'update' | 'warning';
    componentName: string;
    timestamp: number;
    data?: {
        propName?: string;
        propValue?: any;
        renderDuration?: number;
        error?: Error;
        message?: string;
    };
}
export declare class MonitoringService extends EventEmitter {
    private static instance;
    private isMonitoring;
    private sampleInterval;
    private warningThreshold;
    private errorThreshold;
    private metrics;
    private eventHistory;
    private constructor();
    static getInstance(options?: MonitoringOptions): MonitoringService;
    start(): void;
    stop(): void;
    subscribe(callback: (event: MonitoringEvent) => void): () => void;
    unsubscribe(callback: (event: MonitoringEvent) => void): void;
    startMonitoring(): void;
    stopMonitoring(): void;
    trackPropUpdate(componentName: string, propName: string, propValue: any): void;
    trackRender(componentName: string, renderDuration: number): void;
    trackError(componentName: string, error: Error): void;
    trackUpdate(componentName: string, message: string): void;
    trackWarning(componentName: string, message: string): void;
    getEventHistory(): MonitoringEvent[];
    clearEventHistory(): void;
    private collectPerformanceMetrics;
    private checkViolations;
}
export {};
