import { ComponentUsage, PropUsage } from '../types';

export interface PropAnalysisResult {
  components: ComponentUsage[];
  frequentUpdates: Array<{
    componentName: string;
    propName: string;
    updateCount: number;
  }>;
  unusedProps: Array<{
    componentName: string;
    propName: string;
  }>;
  propPatterns: Array<{
    type: 'frequent-updates' | 'unused' | 'dependent';
    components: string[];
    props: string[];
    description: string;
  }>;
}

export function analyzePropUsage(components: ComponentUsage[]): PropAnalysisResult {
  const frequentUpdates = components.flatMap(component =>
    component.props
      .filter((prop: PropUsage) => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.7)
      .map((prop: PropUsage) => ({
        componentName: component.componentName,
        propName: prop.name,
        updateCount: prop.valueChanges || 0
      }))
  );

  const unusedProps = components.flatMap(component =>
    component.props
      .filter((prop: PropUsage) => !prop.usageCount)
      .map((prop: PropUsage) => ({
        componentName: component.componentName,
        propName: prop.name
      }))
  );

  const propPatterns = [
    {
      type: 'frequent-updates' as const,
      components: Array.from(new Set(frequentUpdates.map(u => u.componentName))),
      props: frequentUpdates.map(u => `${u.componentName}.${u.propName}`),
      description: 'Props with high update frequency'
    },
    {
      type: 'unused' as const,
      components: Array.from(new Set(unusedProps.map(p => p.componentName))),
      props: unusedProps.map(p => `${p.componentName}.${p.propName}`),
      description: 'Props that are never used'
    }
  ];

  return {
    components,
    frequentUpdates,
    unusedProps,
    propPatterns
  };
} 