import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styles from '../../styles/base.module.css';
const PropTimeline = ({ data }) => {
    const timelineData = data.components.flatMap(component => component.props.map(prop => ({
        timestamp: Date.now() - (prop.valueChanges || 0) * 1000, // Approximate timestamp
        componentName: component.componentName,
        propName: prop.propName,
        value: prop.lastValue?.value,
        renderCount: prop.lastValue?.renderCount || 0
    }))).sort((a, b) => a.timestamp - b.timestamp);
    const formatValue = (value) => {
        if (value === null)
            return 'null';
        if (value === undefined)
            return 'undefined';
        if (typeof value === 'object')
            return JSON.stringify(value);
        return String(value);
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length)
            return null;
        const data = payload[0].payload;
        return (React.createElement("div", { className: styles.tooltip },
            React.createElement("p", null, new Date(label).toLocaleTimeString()),
            React.createElement("p", null,
                React.createElement("strong", null, data.componentName)),
            React.createElement("p", null,
                data.propName,
                ": ",
                formatValue(data.value)),
            React.createElement("p", null,
                "Render Count: ",
                data.renderCount)));
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Prop Timeline"),
        React.createElement("div", { className: styles['chart-container'] },
            React.createElement(ResponsiveContainer, { width: "100%", height: 400 },
                React.createElement(LineChart, { data: timelineData },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "timestamp", tickFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, { content: React.createElement(CustomTooltip, null) }),
                    React.createElement(Legend, null),
                    React.createElement(Line, { type: "monotone", dataKey: "renderCount", name: "Render Count", stroke: "#8884d8", dot: true })))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Recent Updates"),
            React.createElement("div", { className: styles['data-grid'] }, timelineData.slice(-5).map((event, index) => (React.createElement("div", { key: index, className: styles['data-item'] },
                React.createElement("div", { className: styles['data-label'] }, new Date(event.timestamp).toLocaleTimeString()),
                React.createElement("div", null,
                    React.createElement("strong", null, event.componentName)),
                React.createElement("div", null,
                    event.propName,
                    ": ",
                    formatValue(event.value)),
                React.createElement("div", null,
                    "Render Count: ",
                    event.renderCount))))))));
};
export default PropTimeline;
//# sourceMappingURL=PropTimeline.js.map