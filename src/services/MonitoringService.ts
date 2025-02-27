import { EventEmitter } from 'events';
import { MonitoringEventType, PerformanceMetrics } from '../types';

interface MonitoringOptions {
  sampleInterval?: number;
  warningThreshold?: number;
  errorThreshold?: number;
}

export interface MonitoringEvent {
  type: 'prop-update' | 'render' | 'error';
  componentName: string;
  timestamp: number;
  data?: {
    propName?: string;
    propValue?: any;
    renderDuration?: number;
    error?: Error;
  };
}

export class MonitoringService extends EventEmitter {
  private static instance: MonitoringService;
  private isMonitoring: boolean = false;
  private sampleInterval: number;
  private warningThreshold: number;
  private errorThreshold: number;
  private metrics: PerformanceMetrics = {
    latencies: [],
    errors: 0,
    totalRequests: 0,
    timestamps: []
  };
  private eventHistory: MonitoringEvent[] = [];

  private constructor(options: MonitoringOptions = {}) {
    super();
    this.sampleInterval = options.sampleInterval || 1000;
    this.warningThreshold = options.warningThreshold || 1000;
    this.errorThreshold = options.errorThreshold || 5000;
    this.setMaxListeners(100); // Allow more listeners for real-time monitoring
  }

  public static getInstance(options: MonitoringOptions = {}): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService(options);
    }
    return MonitoringService.instance;
  }

  public start(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.emit('monitoring:started');
    this.startMonitoring();
  }

  public stop(): void {
    if (!this.isMonitoring) return;
    this.isMonitoring = false;
    this.emit('monitoring:stopped');
  }

  public subscribe(callback: (event: MonitoringEvent) => void): () => void {
    this.on('monitoring-event', callback);
    return () => this.unsubscribe(callback);
  }

  public unsubscribe(callback: (event: MonitoringEvent) => void): void {
    this.off('monitoring-event', callback);
  }

  public startMonitoring(): void {
    if (!this.isMonitoring) {
      this.isMonitoring = true;
      this.eventHistory = [];
    }
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
  }

  public trackPropUpdate(componentName: string, propName: string, propValue: any): void {
    if (!this.isMonitoring) return;

    const event: MonitoringEvent = {
      type: 'prop-update',
      componentName,
      timestamp: Date.now(),
      data: {
        propName,
        propValue
      }
    };

    this.eventHistory.push(event);
    this.emit('monitoring-event', event);
  }

  public trackRender(componentName: string, renderDuration: number): void {
    if (!this.isMonitoring) return;

    const event: MonitoringEvent = {
      type: 'render',
      componentName,
      timestamp: Date.now(),
      data: {
        renderDuration
      }
    };

    this.eventHistory.push(event);
    this.emit('monitoring-event', event);
  }

  public trackError(componentName: string, error: Error): void {
    if (!this.isMonitoring) return;

    const event: MonitoringEvent = {
      type: 'error',
      componentName,
      timestamp: Date.now(),
      data: {
        error
      }
    };

    this.eventHistory.push(event);
    this.emit('monitoring-event', event);
  }

  public getEventHistory(): MonitoringEvent[] {
    return [...this.eventHistory];
  }

  public clearEventHistory(): void {
    this.eventHistory = [];
  }

  private collectPerformanceMetrics(): PerformanceMetrics {
    const entries = performance.getEntriesByType('measure');
    const latencies = entries.map(entry => entry.duration);
    const errors = entries.filter(entry => entry.duration > this.errorThreshold).length;
    const totalRequests = entries.length;

    return {
      latencies,
      errors,
      totalRequests,
      timestamps: this.metrics.timestamps,
      averageLatency: latencies.reduce((sum, val) => sum + val, 0) / latencies.length,
      errorRate: errors / totalRequests,
      throughput: totalRequests / (this.sampleInterval / 1000)
    };
  }

  private checkViolations(metrics: PerformanceMetrics): void {
    const avgLatency = metrics.averageLatency || 0;

    if (avgLatency > this.errorThreshold) {
      this.emit('monitoring:violation', {
        type: 'error',
        message: `Average latency (${avgLatency}ms) exceeds error threshold (${this.errorThreshold}ms)`
      });
    } else if (avgLatency > this.warningThreshold) {
      this.emit('monitoring:violation', {
        type: 'warning',
        message: `Average latency (${avgLatency}ms) exceeds warning threshold (${this.warningThreshold}ms)`
      });
    }
  }
} 