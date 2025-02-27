import { PropAnalyzer } from '../core/PropAnalyzer';
export interface MonitoringEvent {
    type: 'update' | 'warning' | 'error';
    timestamp: number;
    data: any;
}
export declare class MonitoringService {
    private static instance;
    private analyzer;
    private listeners;
    private updateInterval;
    private intervalId?;
    private constructor();
    static getInstance(): MonitoringService;
    startMonitoring(interval?: number): void;
    stopMonitoring(): void;
    subscribe(listener: (event: MonitoringEvent) => void): () => void;
    getAnalyzer(): PropAnalyzer;
    private notifyListeners;
    private checkForWarnings;
}
