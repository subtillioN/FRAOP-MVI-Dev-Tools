import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
const PropTimeline = ({ data }) => {
    const generateTimelineData = () => {
        const timelineData = data.components.flatMap(component => component.props.map(prop => ({
            componentName: component.componentName,
            propName: prop.name,
            timestamp: Date.now() - (prop.valueChanges || 0) * 1000, // Approximate timestamp
            type: 'update',
            value: prop.lastValue
        })));
        return timelineData.sort((a, b) => a.timestamp - b.timestamp);
    };
    const timelineData = generateTimelineData();
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Prop Timeline"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Component Updates Over Time"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(LineChart, { width: 800, height: 400, data: timelineData },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "timestamp", tickFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(YAxis, { dataKey: "componentName" }),
                    React.createElement(Tooltip, { labelFormatter: value => new Date(value).toLocaleTimeString(), formatter: (value, name) => {
                            if (name === 'value') {
                                if (value === null)
                                    return 'null';
                                if (value === undefined)
                                    return 'undefined';
                                if (typeof value === 'object')
                                    return JSON.stringify(value);
                                return String(value);
                            }
                            return value;
                        } }),
                    React.createElement(Line, { type: "monotone", dataKey: "value", stroke: "#8884d8", name: "Value" })))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Recent Updates"),
            React.createElement("div", { className: styles['data-grid'] }, timelineData.slice(-5).map((event, index) => (React.createElement("div", { key: index, className: styles['data-item'] },
                React.createElement("div", { className: styles['data-label'] }, new Date(event.timestamp).toLocaleTimeString()),
                React.createElement("div", null,
                    React.createElement("strong", null, event.componentName)),
                React.createElement("div", null,
                    event.propName,
                    ": ",
                    event.value !== undefined ? String(event.value) : 'undefined'),
                React.createElement("div", { className: styles[`performance-${event.type}`] }, event.type.toUpperCase()))))))));
};
export default PropTimeline;
//# sourceMappingURL=index.js.map