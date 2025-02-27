import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styles from '../../styles/base.module.css';
const RealTimeMonitoring = ({ data, monitoringService }) => {
    const [metrics, setMetrics] = useState([]);
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        const handleEvent = (event) => {
            if (event.type === 'render' && event.data?.renderDuration !== undefined) {
                const renderDuration = event.data.renderDuration;
                setMetrics(prevMetrics => {
                    const newMetric = {
                        timestamp: Date.now(),
                        renderCount: 1,
                        averageRenderTime: renderDuration,
                        totalComponents: 1
                    };
                    const newMetrics = [...prevMetrics, newMetric].slice(-60); // Keep last 60 data points
                    return newMetrics;
                });
            }
            else if (event.type === 'warning' && event.data?.message) {
                const message = event.data.message;
                if (typeof message === 'string') {
                    setAlerts(prev => [...prev, message]);
                }
            }
        };
        const unsubscribe = monitoringService.subscribe(handleEvent);
        return () => {
            unsubscribe();
        };
    }, [monitoringService]);
    useEffect(() => {
        if (data) {
            const totalRenderCount = data.components.reduce((sum, c) => sum + c.props.reduce((propSum, p) => propSum + (p.valueChanges || 0), 0), 0);
            const totalComponents = data.components.length;
            if (totalComponents > 0) {
                setMetrics(prevMetrics => {
                    const newMetric = {
                        timestamp: Date.now(),
                        renderCount: totalRenderCount,
                        averageRenderTime: totalRenderCount / totalComponents,
                        totalComponents
                    };
                    const newMetrics = [...prevMetrics, newMetric].slice(-60);
                    return newMetrics;
                });
            }
        }
    }, [data]);
    const calculateAverageRenderTime = () => {
        if (metrics.length === 0)
            return 0;
        const sum = metrics.reduce((acc, metric) => acc + metric.averageRenderTime, 0);
        return Math.round(sum / metrics.length);
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length)
            return null;
        return (React.createElement("div", { className: styles.tooltip },
            React.createElement("p", null, new Date(label).toLocaleTimeString()),
            payload.map((entry, index) => (React.createElement("p", { key: index, style: { color: entry.color } }, `${entry.name}: ${entry.value}`)))));
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Real-time Performance Monitoring"),
        React.createElement("div", { className: styles['chart-container'] },
            React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
                React.createElement(LineChart, { data: metrics },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "timestamp", tickFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, { content: React.createElement(CustomTooltip, null) }),
                    React.createElement(Legend, null),
                    React.createElement(Line, { type: "monotone", dataKey: "renderCount", name: "Render Count", stroke: "#8884d8", dot: false }),
                    React.createElement(Line, { type: "monotone", dataKey: "averageRenderTime", name: "Average Render Time (ms)", stroke: "#82ca9d", dot: false }),
                    React.createElement(Line, { type: "monotone", dataKey: "totalComponents", name: "Total Components", stroke: "#ff7300", dot: false })))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Current Stats"),
            React.createElement("div", { className: styles['data-grid'] },
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Total Components"),
                    React.createElement("div", { className: styles['data-value'] }, data.components.length)),
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Total Props"),
                    React.createElement("div", { className: styles['data-value'] }, data.components.reduce((sum, c) => sum + c.props.length, 0))),
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Average Render Time"),
                    React.createElement("div", { className: styles['data-value'] },
                        calculateAverageRenderTime(),
                        "ms")))),
        alerts.length > 0 && (React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Alerts"),
            React.createElement("ul", null, alerts.map((alert, index) => (React.createElement("li", { key: index, className: styles.warning }, alert))))))));
};
export default RealTimeMonitoring;
//# sourceMappingURL=RealTimeMonitoring.js.map