import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
// Custom Bar component to handle dynamic fill
const CustomBar = (props) => {
    const { fill, entry, ...rest } = props;
    const fillColor = (() => {
        switch (entry.type) {
            case 'update': return '#ef5350';
            case 'value': return '#4caf50';
            default: return '#ff9800';
        }
    })();
    return React.createElement("rect", { ...rest, fill: fillColor });
};
const PropPatternDetection = ({ data }) => {
    const detectPatterns = () => {
        const patterns = [];
        // Detect frequent update patterns
        const frequentUpdates = data.components.flatMap(component => component.props
            .filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.7)
            .map(prop => ({
            componentName: component.componentName,
            propName: prop.name,
            updateCount: prop.valueChanges || 0
        })));
        if (frequentUpdates.length > 0) {
            patterns.push({
                name: 'Frequent Updates',
                components: [...new Set(frequentUpdates.map(u => u.componentName))],
                props: frequentUpdates.map(u => `${u.componentName}.${u.propName}`),
                frequency: frequentUpdates.length,
                type: 'update'
            });
        }
        // Detect unused props pattern
        if (data.unusedProps.length > 0) {
            patterns.push({
                name: 'Unused Props',
                components: [...new Set(data.unusedProps.map(p => p.componentName))],
                props: data.unusedProps.map(p => `${p.componentName}.${p.propName}`),
                frequency: data.unusedProps.length,
                type: 'unused'
            });
        }
        // Detect prop dependencies
        const propDependencies = new Map();
        data.components.forEach(component => {
            component.props.forEach(prop => {
                const propKey = `${component.componentName}.${prop.name}`;
                if (!propDependencies.has(propKey)) {
                    propDependencies.set(propKey, new Set());
                }
                // Find other props that change when this prop changes
                data.components.forEach(otherComponent => {
                    otherComponent.props.forEach(otherProp => {
                        if (prop.valueChanges && otherProp.valueChanges) {
                            const correlation = Math.abs(prop.valueChanges - otherProp.valueChanges) / prop.valueChanges;
                            if (correlation < 0.2) {
                                propDependencies.get(propKey).add(`${otherComponent.componentName}.${otherProp.name}`);
                            }
                        }
                    });
                });
            });
        });
        // Add dependency patterns
        if (propDependencies.size > 0) {
            patterns.push({
                name: 'Prop Dependencies',
                components: [...new Set([...propDependencies.keys()].map(k => k.split('.')[0]))],
                props: [...propDependencies.keys()],
                frequency: propDependencies.size,
                type: 'value'
            });
        }
        return patterns;
    };
    const patterns = detectPatterns();
    const chartData = patterns.map(pattern => ({
        name: pattern.name,
        value: pattern.frequency,
        type: pattern.type
    }));
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Prop Pattern Detection"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Detected Patterns"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(BarChart, { width: 800, height: 300, data: chartData },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "name" }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, null),
                    React.createElement(Bar, { dataKey: "value", shape: React.createElement(CustomBar, null) })))),
        React.createElement("div", { className: styles.section }, patterns.map((pattern, index) => (React.createElement("div", { key: index, className: styles['data-item'] },
            React.createElement("h3", null, pattern.name),
            React.createElement("div", null,
                React.createElement("strong", null, "Frequency:"),
                " ",
                pattern.frequency),
            React.createElement("div", null,
                React.createElement("strong", null, "Affected Components:"),
                React.createElement("ul", null, pattern.components.map(component => (React.createElement("li", { key: component }, component))))),
            React.createElement("div", null,
                React.createElement("strong", null, "Affected Props:"),
                React.createElement("ul", null, pattern.props.map(prop => (React.createElement("li", { key: prop }, prop)))))))))));
};
export default PropPatternDetection;
//# sourceMappingURL=index.js.map