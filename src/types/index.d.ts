declare module 'fraop-mvi-dev-tools' {
  import { FC } from 'react';

  export interface PropUsage {
    name: string;
    type: string;
    required: boolean;
    usageCount: number;
    defaultValue?: any;
    valueChanges?: number;
    lastValue?: any;
  }

  export interface ComponentUsage {
    componentName: string;
    props: PropUsage[];
  }

  export interface UnusedProp {
    componentName: string;
    propName: string;
    updateCount: number;
  }

  export type PropPatternType = 'update' | 'value';

  export interface PropPattern {
    type: PropPatternType;
    frequency: number;
  }

  export interface FrequentUpdate {
    componentName: string;
    propName: string;
  }

  export interface PropAnalysisResult {
    components: ComponentUsage[];
    unusedProps: UnusedProp[];
    propPatterns: PropPattern[];
    frequentUpdates: FrequentUpdate[];
  }

  export interface DevToolsButtonProps {
    onClick: () => void;
    isOpen: boolean;
  }

  export interface DevToolsPanelProps {
    isOpen: boolean;
  }

  export const DevToolsButton: FC<DevToolsButtonProps>;
  export const DevToolsPanel: FC<DevToolsPanelProps>;
  export const MonitoringDashboard: FC<{ data: PropAnalysisResult }>;
  export const PropPatternDetection: FC<{ data: PropAnalysisResult }>;
  export const PropTimeline: FC<{ data: PropAnalysisResult }>;
  export const RealTimeMonitoring: FC<{ data: PropAnalysisResult }>;
  export const PerformanceImpact: FC<{ data: PropAnalysisResult }>;
  export const OptimizationRecommendations: FC<{ data: PropAnalysisResult }>;

  export class PropAnalyzer {
    static getInstance(): PropAnalyzer;
    analyze(): PropAnalysisResult;
  }

  export interface MonitoringEvent {
    type: 'metrics' | 'alert' | 'violation';
    timestamp: number;
    data: any;
  }

  export class MonitoringService {
    static getInstance(): MonitoringService;
    subscribe(callback: (event: MonitoringEvent) => void): () => void;
    startMonitoring(): void;
    stopMonitoring(): void;
  }
} 