import { EventEmitter } from 'events';
export type MonitoringEventType = 'update' | 'prop-update' | 'render' | 'error' | 'warning';
export interface MonitoringEvent {
    type: MonitoringEventType;
    componentName: string;
    timestamp: number;
    data?: {
        propName?: string;
        propValue?: any;
        renderDuration?: number;
        error?: Error;
        message?: string;
        violations?: string[];
    };
}
export declare class MonitoringService extends EventEmitter {
    private static instance;
    private isMonitoring;
    private updateInterval;
    private constructor();
    static getInstance(): MonitoringService;
    startMonitoring(interval?: number): void;
    stopMonitoring(): void;
    trackPropUpdate(componentName: string, propName: string, value: any): void;
    trackRender(componentName: string, duration: number): void;
    reportError(componentName: string, error: Error): void;
    reportWarning(componentName: string, message: string): void;
    subscribe(callback: (event: MonitoringEvent) => void): () => void;
}
