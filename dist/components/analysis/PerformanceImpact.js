import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
const PerformanceImpact = ({ data }) => {
    const generateTreemapData = () => {
        return data.components.map(component => {
            const totalUpdates = component.props.reduce((sum, prop) => sum + (prop.valueChanges || 0), 0);
            const children = component.props.map(prop => ({
                name: prop.propName,
                size: prop.valueChanges || 0,
                impact: getImpactLevel(prop.valueChanges || 0, prop.usageCount || 1)
            }));
            return {
                name: component.componentName,
                size: totalUpdates,
                impact: getImpactLevel(totalUpdates, component.props.reduce((sum, p) => sum + (p.usageCount || 1), 0)),
                children
            };
        });
    };
    const getImpactLevel = (updates, renders) => {
        const ratio = updates / renders;
        if (ratio > 0.75)
            return 'high';
        if (ratio > 0.5)
            return 'medium';
        return 'low';
    };
    const getImpactColor = (impact) => {
        switch (impact) {
            case 'high':
                return '#ef5350';
            case 'medium':
                return '#ff9800';
            case 'low':
                return '#4caf50';
        }
    };
    const treemapData = generateTreemapData();
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length)
            return null;
        const data = payload[0].payload;
        return (React.createElement("div", { className: styles.tooltip },
            React.createElement("p", null,
                React.createElement("strong", null, data.name)),
            React.createElement("p", null,
                "Updates: ",
                data.size),
            data.impact && React.createElement("p", null,
                "Impact: ",
                data.impact.toUpperCase())));
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Performance Impact Analysis"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Component Update Impact"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(ResponsiveContainer, { width: "100%", height: 400 },
                    React.createElement(Treemap, { data: treemapData, dataKey: "size", stroke: "#fff", fill: "#8884d8" },
                        React.createElement(Tooltip, { content: React.createElement(CustomTooltip, null) }))))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Impact Details"),
            React.createElement("div", { className: styles['data-grid'] }, treemapData.map(component => (React.createElement("div", { key: component.name, className: styles['data-item'] },
                React.createElement("h4", null, component.name),
                React.createElement("div", { className: styles[`impact-${component.impact}`] },
                    "Impact: ",
                    component.impact?.toUpperCase()),
                React.createElement("div", null,
                    React.createElement("strong", null, "Total Updates:"),
                    " ",
                    component.size),
                component.children && component.children.length > 0 && (React.createElement("div", null,
                    React.createElement("strong", null, "Props by Impact:"),
                    React.createElement("ul", null, component.children
                        .sort((a, b) => b.size - a.size)
                        .map(prop => (React.createElement("li", { key: prop.name },
                        prop.name,
                        ": ",
                        prop.size,
                        " updates",
                        React.createElement("span", { className: styles[`impact-${prop.impact}`] },
                            ' ',
                            "(",
                            prop.impact,
                            ")"))))))))))))));
};
export default PerformanceImpact;
//# sourceMappingURL=PerformanceImpact.js.map