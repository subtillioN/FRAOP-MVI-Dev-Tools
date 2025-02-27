import { ComponentType, ReactNode } from 'react';

// Core configuration
export interface DevToolsConfig {
  features: DevToolsFeature[];
  theme: 'light' | 'dark';
  position: {
    x: number;
    y: number;
  };
  target?: HTMLElement;
  enabled: boolean;
  monitoringInterval?: number;
  maxEventsStored?: number;
  excludeComponents?: string[];
}

// Feature types
export type DevToolsFeature = 
  | 'monitoring'
  | 'optimization'
  | 'analysis'
  | 'performance';

// Analysis types
export interface AnalysisResult {
  componentName: string;
  metrics: ComponentMetrics;
  issues: AnalysisIssue[];
  suggestions: Suggestion[];
}

export interface ComponentMetrics {
  renderCount: number;
  renderTime: number;
  memoryUsage: number;
  propUpdateFrequency: number;
}

export interface AnalysisIssue {
  type: 'performance' | 'architecture' | 'patterns';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: string;
  suggestion?: string;
}

export interface Suggestion {
  type: 'optimization' | 'refactor' | 'pattern';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  code?: string;
}

// Integration types
export interface DevToolsIntegration {
  init(config: DevToolsConfig): void;
  analyze(component: any): AnalysisResult;
  DevToolsButton: ComponentType<DevToolsButtonProps>;
  DevToolsPanel: ComponentType<DevToolsPanelProps>;
}

export interface DevToolsButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export interface DevToolsPanelProps {
  isOpen: boolean;
}

// Architecture validation types
export interface ArchitecturalAnalysis {
  violations: Array<{
    type: string;
    message: string;
    location: string;
  }>;
  dependencies: Array<{
    from: string;
    to: string;
    type: string;
  }>;
}

export interface PropUsage {
  name: string;
  type: string;
  required: boolean;
  usageCount: number;
  valueChanges: number;
}

export interface ComponentAnalysis {
  componentName: string;
  props: PropUsage[];
  renderCount: number;
}

export interface PropAnalysisResult {
  components: ComponentAnalysis[];
  unusedProps: Array<{
    componentName: string;
    propName: string;
  }>;
  propPatterns: Array<{
    components: string[];
    props: string[];
    type: string;
  }>;
}

export interface Pattern {
  components: string[];
  props: string[];
  type: string;
}

export interface FrequentUpdate {
  componentName: string;
  propName: string;
  updateCount: number;
}

export interface MonitoringEvent {
  timestamp: number;
  type: string;
  componentName: string;
  propName?: string;
  value?: any;
}

// Core types
export type { Option, Some, NoneType } from '../utils/option';

// Validation types
export type { ValidationRule, ValidationResult } from './functional';
export type { Pattern as FunctionalPattern } from './functional';

// Script types
export type { default as ValidateFunctional } from '../scripts/validate-functional';
export type { default as ValidateModuleBoundaries } from '../scripts/validate-module-boundaries';
export type { default as TtsdWatch } from '../scripts/ttsd-watch';

// CLI types
export type ValidationType = 'functional' | 'modules' | 'all';

export interface CLI {
  validate: (type: ValidationType) => Promise<void>;
  ttsdWatch: () => Promise<void>;
} 