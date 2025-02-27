import { Component, ComponentType } from 'react';
import { Validator } from 'prop-types';

export interface PropUsage {
  name: string;
  type: string;
  required: boolean;
  usageCount: number;
  valueChanges: number;
  lastValue: any;
}

export interface ComponentUsage {
  componentName: string;
  renderCount: number;
  props: PropUsage[];
}

export interface Pattern {
  id: string;
  type: 'dependent' | 'independent' | 'correlated';
  description: string;
  components: string[];
  props: string[];
  confidence: number;
}

export interface PropAnalysisResult {
  components: ComponentUsage[];
  propPatterns: Pattern[];
  unusedProps: PropUsage[];
  timestamp: number;
}

interface PropTypeMap {
  [key: string]: Validator<any>;
}

type ComponentWithPropTypes = ComponentType<any> & {
  propTypes?: PropTypeMap;
};

export class PropAnalyzer {
  private componentUsage: Map<string, ComponentUsage>;
  private renderCounts: Map<string, number>;

  constructor() {
    this.componentUsage = new Map();
    this.renderCounts = new Map();
  }

  trackPropUsage(component: ComponentWithPropTypes, props: any, componentName: string): void {
    let usage = this.componentUsage.get(componentName);
    if (!usage) {
      usage = {
        componentName,
        renderCount: 0,
        props: []
      };
      this.componentUsage.set(componentName, usage);
    }

    // Update render count
    usage.renderCount = (usage.renderCount || 0) + 1;
    this.renderCounts.set(componentName, usage.renderCount);

    // Track props
    Object.entries(props).forEach(([name, value]) => {
      let propUsage = usage!.props.find(p => p.name === name);
      if (!propUsage) {
        propUsage = {
          name,
          type: typeof value,
          required: component.propTypes?.[name] !== undefined,
          usageCount: 0,
          valueChanges: 0,
          lastValue: value
        };
        usage!.props.push(propUsage);
      }

      propUsage.usageCount++;
      if (propUsage.lastValue !== value) {
        propUsage.valueChanges++;
        propUsage.lastValue = value;
      }
    });
  }

  getComponentPropUsage(componentName: string): ComponentUsage | undefined {
    return this.componentUsage.get(componentName);
  }

  getRenderCount(componentName: string): number {
    return this.renderCounts.get(componentName) || 0;
  }

  analyzeProps(): PropAnalysisResult {
    const components = Array.from(this.componentUsage.values());
    const propPatterns: Pattern[] = [];
    const unusedProps: PropUsage[] = [];

    // Find unused props
    components.forEach(component => {
      component.props.forEach(prop => {
        if (prop.usageCount === 0) {
          unusedProps.push(prop);
        }
      });
    });

    // Find prop patterns
    components.forEach((component, i) => {
      components.slice(i + 1).forEach(otherComponent => {
        const sharedProps = component.props.filter(prop =>
          otherComponent.props.some(p => p.name === prop.name)
        );

        if (sharedProps.length > 0) {
          propPatterns.push({
            id: `${component.componentName}-${otherComponent.componentName}`,
            type: 'dependent',
            description: `Components share props: ${sharedProps.map(p => p.name).join(', ')}`,
            components: [component.componentName, otherComponent.componentName],
            props: sharedProps.map(p => p.name),
            confidence: sharedProps.length / Math.max(component.props.length, otherComponent.props.length)
          });
        }
      });
    });

    return {
      components,
      propPatterns,
      unusedProps,
      timestamp: Date.now()
    };
  }

  reset(): void {
    this.componentUsage.clear();
    this.renderCounts.clear();
  }
} 