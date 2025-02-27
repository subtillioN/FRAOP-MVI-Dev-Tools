import { PropAnalysisResult, PropUsage, Pattern, FrequentUpdate } from '../utils/propAnalysis';

interface ComponentWithPropTypes {
  propTypes?: {
    [key: string]: {
      isRequired?: boolean;
    };
  };
}

export class PropAnalyzer {
  private componentCache: Map<string, PropUsage[]> = new Map();
  private currentTime: number = Date.now();

  trackPropUsage(component: ComponentWithPropTypes, props: Record<string, any>, componentName: string): void {
    let componentProps = this.componentCache.get(componentName);
    if (!componentProps) {
      componentProps = [];
      this.componentCache.set(componentName, componentProps);
    }

    Object.entries(props).forEach(([propName, value]) => {
      let propUsage = componentProps!.find(p => p.propName === propName);
      if (!propUsage) {
        propUsage = {
          componentName,
          propName,
          type: typeof value,
          required: component.propTypes?.[propName]?.isRequired ?? false,
          usageCount: 0,
          valueChanges: 0,
          lastValue: { value, timestamp: this.currentTime, renderCount: 1 },
          valueHistory: [],
          timestamps: [],
          relatedProps: []
        };
        componentProps!.push(propUsage);
      }

      propUsage.usageCount++;
      if (propUsage.lastValue.value !== value) {
        propUsage.valueChanges++;
        propUsage.valueHistory.push(propUsage.lastValue);
        propUsage.lastValue = { value, timestamp: this.currentTime, renderCount: propUsage.usageCount };
      }
      propUsage.timestamps.push(this.currentTime);
    });
  }

  getAnalysis(): PropAnalysisResult {
    const components = Array.from(this.componentCache.entries()).map(([componentName, props]) => ({
      componentName,
      props
    }));

    const unusedProps = components.flatMap(component => 
      component.props.filter(prop => prop.usageCount === 0)
    );

    const propPatterns = this.detectPatterns(components);
    const frequentUpdates = this.detectFrequentUpdates(components);

    return {
      components,
      unusedProps,
      propPatterns,
      frequentUpdates,
      timestamp: this.currentTime
    };
  }

  private detectPatterns(components: { componentName: string; props: PropUsage[] }[]): Pattern[] {
    const patterns: Pattern[] = [];
    components.forEach((component, i) => {
      components.slice(i + 1).forEach(otherComponent => {
        const sharedProps = component.props.filter(prop =>
          otherComponent.props.some(p => p.propName === prop.propName)
        );

        if (sharedProps.length > 0) {
          patterns.push({
            id: `${component.componentName}-${otherComponent.componentName}`,
            description: `Shared props between ${component.componentName} and ${otherComponent.componentName}`,
            components: [component.componentName, otherComponent.componentName],
            props: sharedProps.map(p => p.propName),
            confidence: sharedProps.length / Math.max(component.props.length, otherComponent.props.length)
          });
        }
      });
    });
    return patterns;
  }

  private detectFrequentUpdates(components: { componentName: string; props: PropUsage[] }[]): FrequentUpdate[] {
    const updates: FrequentUpdate[] = [];
    components.forEach(component => {
      component.props.forEach(prop => {
        if (prop.valueChanges > 10) {
          const intervals = prop.timestamps.slice(1).map((time: number, i: number) => 
            time - prop.timestamps[i]
          );
          const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          updates.push({
            componentName: prop.componentName,
            propName: prop.propName,
            updateCount: prop.valueChanges,
            averageInterval
          });
        }
      });
    });
    return updates;
  }
} 