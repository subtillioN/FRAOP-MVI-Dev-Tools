import { EventEmitter } from 'events';
import { MonitoringEventType, PerformanceMetrics } from '../types';

interface MonitoringOptions {
  sampleInterval?: number;
  warningThreshold?: number;
  errorThreshold?: number;
}

export class MonitoringService extends EventEmitter {
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

  constructor(options: MonitoringOptions = {}) {
    super();
    this.sampleInterval = options.sampleInterval || 1000;
    this.warningThreshold = options.warningThreshold || 1000;
    this.errorThreshold = options.errorThreshold || 5000;
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

  private startMonitoring(): void {
    const collectMetrics = () => {
      if (!this.isMonitoring) return;

      const now = Date.now();
      const metrics = this.collectPerformanceMetrics();
      this.metrics = {
        ...metrics,
        timestamps: [...this.metrics.timestamps, now]
      };

      this.emit('metrics:collected', this.metrics);
      this.checkViolations(this.metrics);

      setTimeout(collectMetrics, this.sampleInterval);
    };

    collectMetrics();
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