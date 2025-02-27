import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Treemap } from 'recharts';
import styles from '../../styles/base.module.css';
const CodeAnalysis = ({ data }) => {
    // Transform data for dependency visualization
    const dependencyData = {
        name: 'dependencies',
        children: data.propPatterns.map(pattern => ({
            name: pattern.description,
            size: pattern.components.length,
            children: pattern.components.map(component => ({
                name: component,
                size: 1
            }))
        }))
    };
    // Transform data for component hierarchy
    const hierarchyData = {
        name: 'components',
        children: data.components.map(component => ({
            name: component.componentName,
            size: component.props.length,
            children: component.props.map(prop => ({
                name: prop.propName,
                size: prop.valueChanges || 1
            }))
        }))
    };
    // Performance metrics data
    const performanceData = data.components.map(component => ({
        name: component.componentName,
        updates: component.props.reduce((sum, prop) => sum + (prop.valueChanges || 0), 0),
        props: component.props.length
    }));
    // Prop usage data
    const propUsageData = data.components.map(component => ({
        name: component.componentName,
        total: component.props.length,
        used: component.props.filter(p => p.usageCount > 0).length,
        unused: component.props.filter(p => p.usageCount === 0).length
    }));
    // Frequent updates data
    const frequentUpdatesData = data.frequentUpdates.map(update => ({
        name: `${update.componentName}.${update.propName}`,
        updates: update.updateCount
    }));
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length)
            return null;
        return (React.createElement("div", { className: styles.tooltip },
            React.createElement("p", null, `${label}`),
            payload.map((entry, index) => (React.createElement("p", { key: index, style: { color: entry.color } }, `${entry.name}: ${entry.value}`)))));
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Code Analysis"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Component Dependencies"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
                    React.createElement(Treemap, { data: [dependencyData], dataKey: "size", stroke: "#fff", fill: "#8884d8" })))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Component Hierarchy"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
                    React.createElement(Treemap, { data: [hierarchyData], dataKey: "size", stroke: "#fff", fill: "#82ca9d" })))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Performance Metrics"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
                    React.createElement(BarChart, { data: performanceData },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(XAxis, { dataKey: "name" }),
                        React.createElement(YAxis, null),
                        React.createElement(Tooltip, { content: React.createElement(CustomTooltip, null) }),
                        React.createElement(Legend, null),
                        React.createElement(Bar, { dataKey: "updates", name: "Updates", fill: "#8884d8" }),
                        React.createElement(Bar, { dataKey: "props", name: "Props", fill: "#82ca9d" }))))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Prop Usage"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
                    React.createElement(BarChart, { data: propUsageData },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(XAxis, { dataKey: "name" }),
                        React.createElement(YAxis, null),
                        React.createElement(Tooltip, { content: React.createElement(CustomTooltip, null) }),
                        React.createElement(Legend, null),
                        React.createElement(Bar, { dataKey: "used", name: "Used Props", stackId: "a", fill: "#4caf50" }),
                        React.createElement(Bar, { dataKey: "unused", name: "Unused Props", stackId: "a", fill: "#f44336" }))))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Frequent Updates"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
                    React.createElement(BarChart, { data: frequentUpdatesData },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(XAxis, { dataKey: "name", angle: -45, textAnchor: "end", height: 100 }),
                        React.createElement(YAxis, null),
                        React.createElement(Tooltip, { content: React.createElement(CustomTooltip, null) }),
                        React.createElement(Legend, null),
                        React.createElement(Bar, { dataKey: "updates", name: "Update Count", fill: "#ff4081" })))))));
};
export default CodeAnalysis;
//# sourceMappingURL=CodeAnalysis.js.map