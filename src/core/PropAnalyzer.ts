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
  updateCount: number;
}

export interface PropAnalysisResult {
  components: ComponentUsage[];
  unusedProps: UnusedProp[];
  propPatterns: PropPattern[];
  frequentUpdates: FrequentUpdate[];
}

export class PropAnalyzer {
  private static instance: PropAnalyzer;
  private components: Map<string, ComponentUsage> = new Map();

  private constructor() {}

  public static getInstance(): PropAnalyzer {
    if (!PropAnalyzer.instance) {
      PropAnalyzer.instance = new PropAnalyzer();
    }
    return PropAnalyzer.instance;
  }

  public analyzeProps(): PropAnalysisResult {
    const components = Array.from(this.components.values());
    const unusedProps = this.findUnusedProps(components);
    const propPatterns = this.findPropPatterns(components);
    const frequentUpdates = this.findFrequentUpdates(components);

    return {
      components,
      unusedProps,
      propPatterns,
      frequentUpdates
    };
  }

  private findUnusedProps(components: ComponentUsage[]): UnusedProp[] {
    return components.flatMap(component =>
      component.props
        .filter(prop => prop.usageCount === 0)
        .map(prop => ({
          componentName: component.componentName,
          propName: prop.name,
          updateCount: 0
        }))
    );
  }

  private findPropPatterns(components: ComponentUsage[]): PropPattern[] {
    const patterns: PropPattern[] = [];
    const allProps = components.flatMap(c => c.props);

    // Find update patterns
    const updateRatios = allProps.map(prop => 
      (prop.valueChanges || 0) / (prop.usageCount || 1)
    );
    const avgUpdateRatio = updateRatios.reduce((a, b) => a + b, 0) / updateRatios.length;

    if (avgUpdateRatio > 0.5) {
      patterns.push({
        type: 'update',
        frequency: avgUpdateRatio
      });
    }

    // Find value patterns
    const valueTypes = new Map<string, number>();
    allProps.forEach(prop => {
      const count = valueTypes.get(prop.type) || 0;
      valueTypes.set(prop.type, count + 1);
    });

    valueTypes.forEach((count, type) => {
      const frequency = count / allProps.length;
      if (frequency > 0.3) {
        patterns.push({
          type: 'value',
          frequency
        });
      }
    });

    return patterns;
  }

  private findFrequentUpdates(components: ComponentUsage[]): FrequentUpdate[] {
    return components.flatMap(component =>
      component.props
        .filter(prop => (prop.valueChanges || 0) > 100)
        .map(prop => ({
          componentName: component.componentName,
          propName: prop.name,
          updateCount: prop.valueChanges || 0
        }))
    );
  }

  public reset(): void {
    this.components.clear();
  }
} 