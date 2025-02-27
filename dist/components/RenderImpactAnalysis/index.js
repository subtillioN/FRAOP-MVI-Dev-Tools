import React from 'react';
import { Treemap, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
const RenderImpactAnalysis = ({ data }) => {
    const generateTreemapData = () => {
        return data.components.map(component => {
            const totalUpdates = component.props.reduce((sum, prop) => sum + (prop.valueChanges || 0), 0);
            const children = component.props.map(prop => ({
                name: prop.name,
                size: prop.valueChanges || 0
            }));
            // Find components that are affected by this component's updates
            const affectedComponents = data.components
                .filter(c => c.componentName !== component.componentName)
                .filter(c => {
                const hasSharedProps = c.props.some(p => component.props.some(cp => cp.name === p.name));
                return hasSharedProps;
            })
                .map(c => c.componentName);
            return {
                name: component.componentName,
                size: totalUpdates,
                children: [
                    ...children,
                    ...affectedComponents.map(name => ({
                        name: `Affects: ${name}`,
                        size: 1
                    }))
                ]
            };
        });
    };
    const treemapData = generateTreemapData();
    return (React.createElement("div", { className: styles.container, "data-testid": "render-impact-analysis" },
        React.createElement("h2", null, "Render Impact Analysis"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Component Update Relationships"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(Treemap, { width: 800, height: 400, data: treemapData, dataKey: "size", stroke: "#fff", fill: "#8884d8" },
                    React.createElement(Tooltip, { content: ({ payload }) => {
                            if (!payload?.length)
                                return null;
                            const data = payload[0].payload;
                            return (React.createElement("div", { className: styles.tooltip },
                                React.createElement("div", null, data.name),
                                React.createElement("div", null,
                                    "Updates: ",
                                    data.size)));
                        } })))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Impact Analysis"),
            React.createElement("div", { className: styles['data-grid'] }, data.components.map(component => {
                const totalUpdates = component.props.reduce((sum, prop) => sum + (prop.valueChanges || 0), 0);
                const highImpactProps = component.props
                    .filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.5)
                    .map(prop => ({
                    name: prop.name,
                    updateCount: prop.valueChanges || 0
                }));
                const affectedComponents = data.components
                    .filter(c => c.componentName !== component.componentName)
                    .filter(c => {
                    const hasSharedProps = c.props.some(p => component.props.some(cp => cp.name === p.name));
                    return hasSharedProps;
                })
                    .map(c => c.componentName);
                return (React.createElement("div", { key: component.componentName, className: styles['data-item'] },
                    React.createElement("h4", null, component.componentName),
                    React.createElement("div", null,
                        React.createElement("strong", null, "Total Updates:"),
                        " ",
                        totalUpdates),
                    highImpactProps.length > 0 && (React.createElement("div", null,
                        React.createElement("strong", null, "High Impact Props:"),
                        React.createElement("ul", null, highImpactProps.map(prop => (React.createElement("li", { key: prop.name },
                            prop.name,
                            " (",
                            prop.updateCount,
                            " updates)")))))),
                    affectedComponents.length > 0 && (React.createElement("div", null,
                        React.createElement("strong", null, "Affects Components:"),
                        React.createElement("ul", null, affectedComponents.map(name => (React.createElement("li", { key: name }, name))))))));
            })))));
};
export default RenderImpactAnalysis;
//# sourceMappingURL=index.js.map