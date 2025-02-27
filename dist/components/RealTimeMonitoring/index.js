import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
const RealTimeMonitoring = ({ monitoringService, data }) => {
    const [events, setEvents] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [metrics, setMetrics] = useState([]);
    useEffect(() => {
        const unsubscribe = monitoringService.subscribe((event) => {
            if (event.type === 'update') {
                setEvents(prevEvents => [...prevEvents, event].slice(-100)); // Keep last 100 events
            }
            else if (event.type === 'warning' && event.data?.message) {
                const message = event.data.message;
                if (message) {
                    setAlerts(prev => [...prev, message]);
                }
            }
            // Update metrics
            if (event.type === 'render' && event.data?.renderDuration !== undefined) {
                const renderDuration = event.data.renderDuration;
                setMetrics(prevMetrics => {
                    const newMetric = {
                        timestamp: event.timestamp,
                        renderCount: 1,
                        averageRenderTime: renderDuration,
                        totalComponents: 1
                    };
                    const newMetrics = [...prevMetrics, newMetric].slice(-60); // Keep last 60 data points
                    return newMetrics;
                });
            }
        });
        return () => {
            unsubscribe();
        };
    }, [monitoringService]);
    useEffect(() => {
        if (data) {
            const totalRenderCount = data.components.reduce((sum, c) => sum + c.renderCount, 0);
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
    const renderEventDetails = (event) => {
        switch (event.type) {
            case 'prop-update':
                return (React.createElement("div", null,
                    React.createElement("strong", null, "Prop Update:"),
                    " ",
                    event.componentName,
                    ".",
                    event.data?.propName,
                    " =",
                    ' ',
                    JSON.stringify(event.data?.propValue)));
            case 'render':
                return (React.createElement("div", null,
                    React.createElement("strong", null, "Render:"),
                    " ",
                    event.componentName,
                    " (",
                    event.data?.renderDuration,
                    "ms)"));
            case 'error':
                return (React.createElement("div", null,
                    React.createElement("strong", null, "Error:"),
                    " ",
                    event.componentName,
                    " - ",
                    event.data?.error?.message));
            case 'update':
                return (React.createElement("div", null,
                    React.createElement("strong", null, "Update:"),
                    " ",
                    event.componentName,
                    " - ",
                    event.data?.message));
            case 'warning':
                return (React.createElement("div", null,
                    React.createElement("strong", null, "Warning:"),
                    " ",
                    event.componentName,
                    " - ",
                    event.data?.message));
            default:
                return null;
        }
    };
    const calculateAverageRenderTime = () => {
        if (metrics.length === 0)
            return 0;
        const sum = metrics.reduce((acc, metric) => acc + metric.averageRenderTime, 0);
        return Math.round(sum / metrics.length);
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Real-time Monitoring"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Performance Metrics"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(LineChart, { width: 800, height: 400, data: metrics },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "timestamp", tickFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, { labelFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(Line, { type: "monotone", dataKey: "renderCount", stroke: "#8884d8", name: "Render Count" }),
                    React.createElement(Line, { type: "monotone", dataKey: "averageRenderTime", stroke: "#82ca9d", name: "Average Render Time (ms)" }),
                    React.createElement(Line, { type: "monotone", dataKey: "totalComponents", stroke: "#ff7300", name: "Total Components" })))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Current Stats"),
            React.createElement("div", { className: styles['data-grid'] },
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Total Components"),
                    React.createElement("div", { className: styles['data-value'] }, data?.components.length)),
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Total Props"),
                    React.createElement("div", { className: styles['data-value'] }, data?.components.reduce((sum, c) => sum + c.props.length, 0))),
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Average Render Time"),
                    React.createElement("div", { className: styles['data-value'] },
                        calculateAverageRenderTime(),
                        "ms")))),
        alerts.length > 0 && (React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Alerts"),
            React.createElement("ul", null, alerts.map((alert, index) => (React.createElement("li", { key: index, className: styles['performance-low'] }, alert)))))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Real-Time Events"),
            React.createElement("div", { style: { maxHeight: '400px', overflowY: 'auto' } }, events.map((event, index) => (React.createElement("div", { key: index, style: { marginBottom: '8px' } },
                React.createElement("div", null,
                    React.createElement("small", null, new Date(event.timestamp).toLocaleTimeString())),
                renderEventDetails(event))))))));
};
export default RealTimeMonitoring;
//# sourceMappingURL=index.js.map