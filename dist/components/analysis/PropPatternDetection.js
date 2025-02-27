import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import styles from '../../styles/base.module.css';
const PropPatternDetection = ({ data }) => {
    const detectPatterns = () => {
        const patterns = [];
        // Detect frequent update patterns
        const frequentUpdates = data.components.flatMap(component => component.props
            .filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.7)
            .map(prop => ({
            componentName: component.componentName,
            propName: prop.propName,
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
                const propKey = `${component.componentName}.${prop.propName}`;
                if (!propDependencies.has(propKey)) {
                    propDependencies.set(propKey, new Set());
                }
                // Find other props that change when this prop changes
                data.components.forEach(otherComponent => {
                    otherComponent.props.forEach(otherProp => {
                        if (prop.valueChanges && otherProp.valueChanges) {
                            const correlation = Math.abs(prop.valueChanges - otherProp.valueChanges) / prop.valueChanges;
                            if (correlation < 0.2) {
                                propDependencies.get(propKey).add(`${otherComponent.componentName}.${otherProp.propName}`);
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
    const getPatternColor = (type) => {
        switch (type) {
            case 'update':
                return '#ef5350';
            case 'value':
                return '#4caf50';
            case 'unused':
                return '#ff9800';
        }
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length)
            return null;
        const pattern = patterns.find(p => p.name === label);
        if (!pattern)
            return null;
        return (React.createElement("div", { className: styles.tooltip },
            React.createElement("h4", null, pattern.name),
            React.createElement("p", null,
                "Frequency: ",
                pattern.frequency),
            React.createElement("p", null,
                "Type: ",
                pattern.type),
            React.createElement("p", null,
                "Components: ",
                pattern.components.length)));
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Prop Pattern Detection"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Detected Patterns"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
                    React.createElement(BarChart, { data: chartData },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(XAxis, { dataKey: "name" }),
                        React.createElement(YAxis, null),
                        React.createElement(Tooltip, { content: React.createElement(CustomTooltip, null) }),
                        React.createElement(Legend, null),
                        React.createElement(Bar, { dataKey: "value", name: "Frequency" }, chartData.map((entry, index) => (React.createElement(Cell, { key: `cell-${index}`, fill: getPatternColor(entry.type) })))))))),
        React.createElement("div", { className: styles.section }, patterns.map((pattern, index) => (React.createElement("div", { key: index, className: styles['data-item'] },
            React.createElement("h3", null, pattern.name),
            React.createElement("div", null,
                React.createElement("strong", null, "Frequency:"),
                " ",
                pattern.frequency),
            React.createElement("div", null,
                React.createElement("strong", null, "Type:"),
                " ",
                pattern.type),
            React.createElement("div", null,
                React.createElement("strong", null, "Affected Components:"),
                React.createElement("ul", null, pattern.components.map(component => (React.createElement("li", { key: component }, component))))),
            React.createElement("div", null,
                React.createElement("strong", null, "Affected Props:"),
                React.createElement("ul", null, pattern.props.map(prop => (React.createElement("li", { key: prop }, prop)))))))))));
};
export default PropPatternDetection;
//# sourceMappingURL=PropPatternDetection.js.map