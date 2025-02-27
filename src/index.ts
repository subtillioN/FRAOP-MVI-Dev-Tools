// Core functionality
export { PropAnalyzer } from './core/PropAnalyzer';
export type { PropAnalysisResult, PropUsage } from './core/PropAnalyzer';
export { MonitoringService } from './services/MonitoringService';
export type { MonitoringEvent } from './services/MonitoringService';

// Components
export { default as MonitoringDashboard } from './components/MonitoringDashboard';
export { default as OptimizationRecommendations } from './components/OptimizationRecommendations';
export { default as RenderImpactAnalysis } from './components/RenderImpactAnalysis';
export { default as PropValueHistory } from './components/PropValueHistory';
export { default as PropPatternDetection } from './components/PropPatternDetection';
export { default as ComponentRelationship } from './components/ComponentRelationship';
export { default as PropTimeline } from './components/PropTimeline';
export { default as RealTimeMonitoring } from './components/RealTimeMonitoring';
export { default as PerformanceImpact } from './components/PerformanceImpact';
export { default as MemoizationSuggestions } from './components/MemoizationSuggestions';

// Initialization
export function initDevTools(config: {
  target: HTMLElement;
  features?: string[];
  theme?: 'light' | 'dark';
  plugins?: any[];
  position?: { x: number; y: number };
}): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const monitoringService = MonitoringService.getInstance();
  monitoringService.startMonitoring();

  // TODO: Implement initialization logic
  console.log('Dev tools initialized with config:', config);
} 