export { PropAnalyzer } from './core/PropAnalyzer';
export type { PropAnalysisResult, PropUsage } from './core/PropAnalyzer';
export { MonitoringService } from './services/MonitoringService';
export type { MonitoringEvent } from './services/MonitoringService';
export { default as MonitoringDashboard } from './components/MonitoringDashboard';
export { default as OptimizationRecommendations } from './components/OptimizationRecommendations';
export { default as RenderImpactAnalysis } from './components/RenderImpactAnalysis';
export { default as PropValueHistory } from './components/PropValueHistory';
export { default as PropPatternDetection } from './components/PropPatternDetection';
export { default as PropTimeline } from './components/PropTimeline';
export { default as RealTimeMonitoring } from './components/RealTimeMonitoring';
export { default as PerformanceImpact } from './components/PerformanceImpact';
export interface DevToolsConfig {
    target: HTMLElement;
    features?: Array<'monitoring' | 'optimization' | 'analysis' | 'patterns' | 'timeline' | 'performance'>;
    theme?: 'light' | 'dark';
    plugins?: any[];
    position?: {
        x: number;
        y: number;
    };
}
export declare function initDevTools(config: DevToolsConfig): void;
