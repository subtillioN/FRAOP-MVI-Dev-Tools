import React from 'react';
import { Treemap, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
const PerformanceImpact = ({ data }) => {
    const generateImpactData = () => {
        return data.components.map(component => {
            const totalUpdates = component.props.reduce((sum, prop) => sum + (prop.valueChanges || 0), 0);
            const children = component.props.map(prop => ({
                name: prop.name,
                value: prop.valueChanges || 0,
                impact: getImpactLevel(prop.valueChanges || 0, prop.usageCount || 1)
            }));
            return {
                name: component.componentName,
                value: totalUpdates,
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
    const impactData = generateImpactData();
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Performance Impact Analysis"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Component Impact Overview"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(Treemap, { width: 800, height: 400, data: impactData, dataKey: "value", stroke: "#fff", fill: "#8884d8" },
                    React.createElement(Tooltip, { content: ({ payload }) => {
                            if (!payload?.length)
                                return null;
                            const data = payload[0].payload;
                            return (React.createElement("div", { className: styles.tooltip },
                                React.createElement("div", null, data.name),
                                React.createElement("div", null,
                                    "Updates: ",
                                    data.value),
                                React.createElement("div", null,
                                    "Impact: ",
                                    data.impact.toUpperCase())));
                        } })))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Impact Details"),
            React.createElement("div", { className: styles['data-grid'] }, impactData.map(component => (React.createElement("div", { key: component.name, className: styles['data-item'] },
                React.createElement("h4", null, component.name),
                React.createElement("div", { className: styles[`performance-${component.impact}`] },
                    "Impact: ",
                    component.impact.toUpperCase()),
                React.createElement("div", null,
                    React.createElement("strong", null, "Total Updates:"),
                    " ",
                    component.value),
                component.children && component.children.length > 0 && (React.createElement("div", null,
                    React.createElement("strong", null, "Props by Impact:"),
                    React.createElement("ul", null, component.children
                        .sort((a, b) => b.value - a.value)
                        .map(prop => (React.createElement("li", { key: prop.name },
                        prop.name,
                        ": ",
                        prop.value,
                        " updates",
                        React.createElement("span", { className: styles[`performance-${prop.impact}`] },
                            ' ',
                            "(",
                            prop.impact,
                            ")"))))))))))))));
};
export default PerformanceImpact;
//# sourceMappingURL=index.js.map