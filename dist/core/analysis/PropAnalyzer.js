export class PropAnalyzer {
    constructor() {
        this.componentCache = new Map();
        this.currentTime = Date.now();
    }
    trackPropUsage(component, props, componentName) {
        let componentProps = this.componentCache.get(componentName);
        if (!componentProps) {
            componentProps = [];
            this.componentCache.set(componentName, componentProps);
        }
        Object.entries(props).forEach(([propName, value]) => {
            let propUsage = componentProps.find(p => p.propName === propName);
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
                componentProps.push(propUsage);
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
    analyzeProps() {
        const components = Array.from(this.componentCache.entries()).map(([componentName, props]) => ({
            componentName,
            props
        }));
        const unusedProps = components.flatMap(component => component.props.filter(prop => prop.usageCount === 0));
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
    detectPatterns(components) {
        const patterns = [];
        components.forEach((component, i) => {
            components.slice(i + 1).forEach(otherComponent => {
                const sharedProps = component.props.filter(prop => otherComponent.props.some(p => p.propName === prop.propName));
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
    detectFrequentUpdates(components) {
        const updates = [];
        components.forEach(component => {
            component.props.forEach(prop => {
                if (prop.valueChanges > 10) {
                    const intervals = prop.timestamps.slice(1).map((time, i) => time - prop.timestamps[i]);
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
    getComponentPropUsage(componentName) {
        const props = this.componentCache.get(componentName);
        if (!props)
            return undefined;
        return { componentName, props };
    }
    getRenderCount(componentName) {
        const props = this.componentCache.get(componentName);
        if (!props)
            return 0;
        return Math.max(...props.map(p => p.usageCount));
    }
    reset() {
        this.componentCache.clear();
        this.currentTime = Date.now();
    }
}
//# sourceMappingURL=PropAnalyzer.js.map