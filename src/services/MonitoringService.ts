import { PropAnalyzer, PropAnalysisResult } from '../core/PropAnalyzer';

export interface MonitoringEvent {
  type: 'update' | 'warning' | 'error';
  timestamp: number;
  data: any;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private analyzer: PropAnalyzer;
  private listeners: Set<(event: MonitoringEvent) => void>;
  private updateInterval: number;
  private intervalId?: number;

  private constructor() {
    this.analyzer = new PropAnalyzer();
    this.listeners = new Set();
    this.updateInterval = 1000; // 1 second default
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  startMonitoring(interval?: number): void {
    if (interval) {
      this.updateInterval = interval;
    }

    if (this.intervalId) {
      this.stopMonitoring();
    }

    this.intervalId = window.setInterval(() => {
      try {
        const analysis = this.analyzer.analyzeProps();
        this.notifyListeners({
          type: 'update',
          timestamp: Date.now(),
          data: analysis
        });

        this.checkForWarnings(analysis);
      } catch (error) {
        this.notifyListeners({
          type: 'error',
          timestamp: Date.now(),
          data: error
        });
      }
    }, this.updateInterval);
  }

  stopMonitoring(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  subscribe(listener: (event: MonitoringEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getAnalyzer(): PropAnalyzer {
    return this.analyzer;
  }

  private notifyListeners(event: MonitoringEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in monitoring listener:', error);
      }
    });
  }

  private checkForWarnings(analysis: PropAnalysisResult): void {
    // Check for frequent updates
    const highFrequencyUpdates = analysis.frequentUpdates.filter(
      update => update.updateCount > 100
    );

    if (highFrequencyUpdates.length > 0) {
      this.notifyListeners({
        type: 'warning',
        timestamp: Date.now(),
        data: {
          message: 'High frequency prop updates detected',
          components: highFrequencyUpdates
        }
      });
    }

    // Check for unused props
    if (analysis.unusedProps.length > 0) {
      this.notifyListeners({
        type: 'warning',
        timestamp: Date.now(),
        data: {
          message: 'Unused props detected',
          components: analysis.unusedProps
        }
      });
    }

    // Check for components with many props
    const componentsWithManyProps = analysis.components.filter(
      component => component.props.length > 10
    );

    if (componentsWithManyProps.length > 0) {
      this.notifyListeners({
        type: 'warning',
        timestamp: Date.now(),
        data: {
          message: 'Components with many props detected',
          components: componentsWithManyProps.map(c => ({
            name: c.componentName,
            propCount: c.props.length
          }))
        }
      });
    }
  }
} 