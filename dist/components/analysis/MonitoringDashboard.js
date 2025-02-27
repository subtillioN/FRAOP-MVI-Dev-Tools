import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styles from '../../styles/base.module.css';
import { MonitoringService } from '../../services/monitoring/MonitoringService';
const MonitoringDashboard = ({ data }) => {
    const [metricsHistory, setMetricsHistory] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const monitoringService = MonitoringService.getInstance();
    useEffect(() => {
        const handleEvent = (event) => {
            if (event.type === 'update') {
                const newMetrics = calculateMetrics(data);
                setMetricsHistory(prev => {
                    const newHistory = [...prev, newMetrics];
                    return newHistory.slice(-60); // Keep last 60 data points
                });
            }
            else if (event.type === 'warning' && event.data?.message) {
                const message = event.data.message;
                if (typeof message === 'string') {
                    setWarnings(prev => [...prev, message]);
                }
            }
        };
        const unsubscribe = monitoringService.subscribe(handleEvent);
        monitoringService.startMonitoring();
        return () => {
            monitoringService.stopMonitoring();
            unsubscribe();
        };
    }, [data, monitoringService]);
    const calculateMetrics = (analysis) => {
        const activeComponents = analysis.components.length;
        const activeProps = analysis.components.reduce((sum, component) => sum + component.props.filter(p => p.usageCount > 0).length, 0);
        const highUpdateProps = analysis.components.reduce((sum, component) => sum +
            component.props.filter(p => (p.valueChanges || 0) / (p.usageCount || 1) > 0.5).length, 0);
        return {
            timestamp: Date.now(),
            activeComponents,
            activeProps,
            highUpdateProps
        };
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length)
            return null;
        return (React.createElement("div", { className: styles.tooltip },
            React.createElement("p", null, new Date(label).toLocaleTimeString()),
            payload.map((entry, index) => (React.createElement("p", { key: index, style: { color: entry.color } }, `${entry.name}: ${entry.value}`)))));
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Real-time Monitoring"),
        React.createElement("div", { className: styles['chart-container'] },
            React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
                React.createElement(LineChart, { data: metricsHistory },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "timestamp", tickFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, { content: React.createElement(CustomTooltip, null) }),
                    React.createElement(Legend, null),
                    React.createElement(Line, { type: "monotone", dataKey: "activeComponents", name: "Active Components", stroke: "#8884d8", dot: false }),
                    React.createElement(Line, { type: "monotone", dataKey: "activeProps", name: "Active Props", stroke: "#82ca9d", dot: false }),
                    React.createElement(Line, { type: "monotone", dataKey: "highUpdateProps", name: "High Update Props", stroke: "#ff7300", dot: false })))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Current Metrics"),
            React.createElement("div", { className: styles['data-grid'] },
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Components Tracked"),
                    React.createElement("div", { className: styles['data-value'] }, data.components.length)),
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Props Monitored"),
                    React.createElement("div", { className: styles['data-value'] }, data.components.reduce((sum, c) => sum + c.props.length, 0))),
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Frequent Updates"),
                    React.createElement("div", { className: styles['data-value'] }, data.frequentUpdates.length)))),
        warnings.length > 0 && (React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Warnings"),
            React.createElement("ul", null, warnings.map((warning, index) => (React.createElement("li", { key: index, className: styles.warning }, warning))))))));
};
export default MonitoringDashboard;
//# sourceMappingURL=MonitoringDashboard.js.map