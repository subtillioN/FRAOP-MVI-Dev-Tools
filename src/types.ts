export interface DevToolsConfig {
  features: string[];
  theme: 'light' | 'dark';
  position: {
    x: 'left' | 'right';
    y: number;
  };
  target?: HTMLElement;
}

export interface PropUsage {
  name: string;
  type: string;
  value: any;
  required: boolean;
  usageCount: number;
  valueChanges: number;
}

export interface ComponentData {
  componentName: string;
  props: PropUsage[];
  renderCount: number;
}

export interface Pattern {
  type: string;
  components: string[];
  props: string[];
  confidence: number;
}

export interface PropAnalysisResult {
  components: ComponentData[];
  propPatterns: Pattern[];
  unusedProps: PropUsage[];
  timestamp: number;
}

export interface ComponentUsage {
  componentName: string;
  props: PropUsage[];
  renderCount: number;
  lastRenderTime: number;
  renderDurations: number[];
}

export type MonitoringEventType = 'update' | 'warning' | 'start' | 'stop';

export interface MonitoringEvent {
  type: MonitoringEventType;
  data: any;
  timestamp: number;
}

export interface PerformanceMetrics {
  latencies: number[];
  errors: number;
  totalRequests: number;
  timestamps: number[];
  averageLatency?: number;
  errorRate?: number;
  throughput?: number;
} 