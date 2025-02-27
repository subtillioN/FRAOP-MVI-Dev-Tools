import { PropAnalyzer, PropAnalysisResult } from '../core/PropAnalyzer';

export type MonitoringEventType = 'metrics' | 'alert' | 'violation';

export interface MonitoringEvent {
  type: MonitoringEventType;
  timestamp: number;
  data: any;
}

type EventCallback = (event: MonitoringEvent) => void;

export class MonitoringService {
  private static instance: MonitoringService;
  private listeners: EventCallback[] = [];
  private isMonitoring: boolean = false;
  private monitoringInterval: number | null = null;
  private analyzer: PropAnalyzer;

  private constructor() {
    this.analyzer = PropAnalyzer.getInstance();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  public subscribe(callback: EventCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Simulate monitoring events
    this.monitoringInterval = window.setInterval(() => {
      const analysis = this.analyzer.analyzeProps();
      this.checkMetrics(analysis);
      this.checkViolations(analysis);
    }, 1000);
  }

  public stopMonitoring(): void {
    if (!this.isMonitoring) return;
    
    if (this.monitoringInterval !== null) {
      window.clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    this.isMonitoring = false;
  }

  private checkMetrics(analysis: PropAnalysisResult): void {
    this.notifyListeners({
      type: 'metrics',
      timestamp: Date.now(),
      data: analysis
    });
  }

  private checkViolations(analysis: PropAnalysisResult): void {
    // Check for frequent updates
    const highUpdateProps = analysis.frequentUpdates.filter(
      update => update.updateCount > 100
    );

    if (highUpdateProps.length > 0) {
      this.notifyListeners({
        type: 'violation',
        timestamp: Date.now(),
        data: {
          message: 'High frequency prop updates detected',
          props: highUpdateProps
        }
      });
    }

    // Check for unused props
    if (analysis.unusedProps.length > 0) {
      this.notifyListeners({
        type: 'alert',
        timestamp: Date.now(),
        data: {
          message: 'Unused props detected',
          props: analysis.unusedProps
        }
      });
    }
  }

  private notifyListeners(event: MonitoringEvent): void {
    this.listeners.forEach(callback => callback(event));
  }
} 