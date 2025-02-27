// Core exports
export { initDevTools } from './core/init';
export { DevToolsConfig } from './types';

// Base component exports
export {
  useBaseComponent,
  useLifecycle,
  useStream,
  useComponentState,
  useComponentProps,
  type BaseComponentState,
  type LifecycleEvents,
  type Observer,
  type Unsubscribe
} from './core/base-component';

// Stream exports
export {
  type StreamSource,
  type StreamSink,
  type StreamDispose,
  type StreamFactory,
  createSource
} from './core/streams';

// Service exports
export * from './services/monitoring/MonitoringService';

// Type exports
export type { PropAnalysisResult, PropUsage } from './types';

// Component exports
export { default as DevToolsButton } from './components/DevToolsButton';
export { default as DevToolsPanel } from './components/DevToolsPanel';
export { default as MonitoringDashboard } from './components/MonitoringDashboard';
export { default as OptimizationRecommendations } from './components/OptimizationRecommendations';
export { default as RenderImpactAnalysis } from './components/RenderImpactAnalysis';
export { default as PropPatternDetection } from './components/PropPatternDetection';
export { default as PropValueHistory } from './components/PropValueHistory';
export { default as PropTimeline } from './components/PropTimeline';
export { default as PerformanceImpact } from './components/PerformanceImpact';
export { default as RealTimeMonitoring } from './components/RealTimeMonitoring';

// Demo exports
export { default as Demo } from './demo/Demo';

// Components
export * from './components/DevTools/RealTimeMonitoring';
export * from './components/DevTools/OptimizationRecommendations';
export * from './components/DevTools/RenderImpactAnalysis';
export * from './components/DevTools/MemoizationSuggestions';
export * from './components/DevTools/PropPatternDetection';
export * from './components/DevTools/MonitoringDashboard';
export * from './components/DevTools/PerformanceImpact';
export * from './components/DevTools/ComponentRelationship';
export * from './components/DevTools/PropValueHistory';
export * from './components/DevTools/PropTimeline';
export * from './components/MonitoringDashboard';

// Core utilities
export * from './utils/option';

// Validation utilities
export * from './aspects/functional';
export type * from './types/functional';

// Scripts
export { default as validateFunctional } from './scripts/validate-functional';
export { default as validateModuleBoundaries } from './scripts/validate-module-boundaries';
export { default as ttsdWatch } from './scripts/ttsd-watch';

// CLI commands
export const cli = {
  validate: async (type: 'functional' | 'modules' | 'all') => {
    switch (type) {
      case 'functional':
        await import('./scripts/validate-functional').then(m => m.default());
        break;
      case 'modules':
        await import('./scripts/validate-module-boundaries').then(m => m.default());
        break;
      case 'all':
        await Promise.all([
          import('./scripts/validate-functional').then(m => m.default()),
          import('./scripts/validate-module-boundaries').then(m => m.default())
        ]);
        break;
    }
  },
  ttsdWatch: async () => {
    await import('./scripts/ttsd-watch').then(m => m.default());
  }
}; 