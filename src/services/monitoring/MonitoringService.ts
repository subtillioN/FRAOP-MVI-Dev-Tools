import { EventEmitter } from 'events';
import { PropAnalysisResult } from '../../utils/analysis/types';

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

export class MonitoringService extends EventEmitter {
  private static instance: MonitoringService;
  private isMonitoring: boolean = false;
  private updateInterval: NodeJS.Timer | null = null;

  private constructor() {
    super();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  startMonitoring(interval: number = 1000): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.emit('monitoring:started');

    this.updateInterval = setInterval(() => {
      const event: MonitoringEvent = {
        type: 'update',
        componentName: 'System',
        timestamp: Date.now(),
        data: {
          message: 'Monitoring update'
        }
      };
      this.emit('metrics:collected', event);
    }, interval);
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) return;
    this.isMonitoring = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.emit('monitoring:stopped');
  }

  trackPropUpdate(componentName: string, propName: string, value: any): void {
    const event: MonitoringEvent = {
      type: 'prop-update',
      componentName,
      timestamp: Date.now(),
      data: {
        propName,
        propValue: value
      }
    };
    this.emit('metrics:collected', event);
  }

  trackRender(componentName: string, duration: number): void {
    const event: MonitoringEvent = {
      type: 'render',
      componentName,
      timestamp: Date.now(),
      data: {
        renderDuration: duration
      }
    };
    this.emit('metrics:collected', event);
  }

  reportError(componentName: string, error: Error): void {
    const event: MonitoringEvent = {
      type: 'error',
      componentName,
      timestamp: Date.now(),
      data: {
        error,
        message: error.message
      }
    };
    this.emit('metrics:collected', event);
  }

  reportWarning(componentName: string, message: string): void {
    const event: MonitoringEvent = {
      type: 'warning',
      componentName,
      timestamp: Date.now(),
      data: {
        message
      }
    };
    this.emit('metrics:collected', event);
  }

  subscribe(callback: (event: MonitoringEvent) => void): () => void {
    this.on('metrics:collected', callback);
    return () => this.off('metrics:collected', callback);
  }
} 