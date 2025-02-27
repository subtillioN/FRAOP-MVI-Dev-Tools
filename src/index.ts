// Core functionality
export { PropAnalyzer } from './core/PropAnalyzer';
export type { PropAnalysisResult, PropUsage } from './core/PropAnalyzer';
import { MonitoringService } from './services/MonitoringService';
export { MonitoringService } from './services/MonitoringService';
export type { MonitoringEvent } from './services/MonitoringService';

// Components
export { default as MonitoringDashboard } from './components/MonitoringDashboard';
export { default as OptimizationRecommendations } from './components/OptimizationRecommendations';
export { default as RenderImpactAnalysis } from './components/RenderImpactAnalysis';
export { default as PropValueHistory } from './components/PropValueHistory';
export { default as PropPatternDetection } from './components/PropPatternDetection';
export { default as PropTimeline } from './components/PropTimeline';
export { default as RealTimeMonitoring } from './components/RealTimeMonitoring';
export { default as PerformanceImpact } from './components/PerformanceImpact';

// Configuration types
export interface DevToolsConfig {
  target: HTMLElement;
  features?: Array<
    | 'monitoring'
    | 'optimization'
    | 'analysis'
    | 'patterns'
    | 'timeline'
    | 'performance'
  >;
  theme?: 'light' | 'dark';
  plugins?: any[];
  position?: { x: number; y: number };
}

// Initialization
export function initDevTools(config: DevToolsConfig): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const {
    target,
    features = ['monitoring', 'optimization', 'analysis'],
    theme = 'light',
    position = { x: 0, y: 0 }
  } = config;

  // Initialize monitoring service
  const monitoringService = MonitoringService.getInstance();
  monitoringService.startMonitoring();

  // Create container
  const container = document.createElement('div');
  container.id = 'fraop-dev-tools';
  container.style.position = 'fixed';
  container.style.top = `${position.y}px`;
  container.style.right = `${position.x}px`;
  container.style.zIndex = '9999';
  container.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
  container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  container.style.borderRadius = '4px';
  container.style.padding = '16px';
  container.style.width = '400px';
  container.style.height = '600px';
  container.style.overflow = 'auto';

  // Add theme class
  container.classList.add(`fraop-theme-${theme}`);

  // Initialize features
  if (features.includes('monitoring')) {
    const dashboard = document.createElement('div');
    dashboard.id = 'fraop-monitoring-dashboard';
    container.appendChild(dashboard);
  }

  // Mount container
  target.appendChild(container);

  // Initialize plugins
  if (config.plugins) {
    config.plugins.forEach(plugin => {
      try {
        plugin.init?.();
      } catch (error) {
        console.error(`Failed to initialize plugin: ${plugin.name}`, error);
      }
    });
  }

  console.log('Dev tools initialized with config:', config);
} 