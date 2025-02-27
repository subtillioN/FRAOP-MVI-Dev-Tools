import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MonitoringService } from '../../services/MonitoringService';
import styles from '../../styles/base.module.css';
const MonitoringDashboard = ({ data }) => {
    const [metricsHistory, setMetricsHistory] = useState([]);
    const [warnings, setWarnings] = useState([]);
    useEffect(() => {
        const monitoringService = MonitoringService.getInstance();
        const unsubscribe = monitoringService.subscribe((event) => {
            if (event.type === 'metrics') {
                const analysis = event.data;
                const newMetrics = calculateMetrics(analysis);
                setMetricsHistory(prev => {
                    const newHistory = [...prev, newMetrics];
                    // Keep last 60 data points (1 minute at 1s interval)
                    return newHistory.slice(-60);
                });
            }
            else if (event.type === 'alert') {
                setWarnings(prev => [...prev, event.data.message]);
            }
        });
        // Start monitoring when component mounts
        monitoringService.startMonitoring();
        return () => {
            monitoringService.stopMonitoring();
            unsubscribe();
        };
    }, []);
    const isActivelyUsed = (prop) => {
        return (prop.usageCount || 0) > 0;
    };
    const hasHighUpdateRate = (prop) => {
        const usageCount = prop.usageCount || 1;
        const valueChanges = prop.valueChanges || 0;
        return valueChanges / usageCount > 0.5;
    };
    const calculateMetrics = (analysis) => {
        const activeComponents = analysis.components.length;
        const activeProps = analysis.components.reduce((sum, component) => sum + component.props.filter(isActivelyUsed).length, 0);
        const highUpdateProps = analysis.components.reduce((sum, component) => sum + component.props.filter(hasHighUpdateRate).length, 0);
        return {
            timestamp: Date.now(),
            activeComponents,
            activeProps,
            highUpdateProps
        };
    };
    return (React.createElement("div", { className: styles.container, "data-testid": "monitoring-dashboard" },
        React.createElement("h2", null, "Real-time Monitoring"),
        React.createElement("div", { className: styles.chartContainer },
            React.createElement(LineChart, { width: 800, height: 400, data: metricsHistory },
                React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                React.createElement(XAxis, { dataKey: "timestamp", tickFormatter: value => new Date(value).toLocaleTimeString() }),
                React.createElement(YAxis, null),
                React.createElement(Tooltip, { labelFormatter: value => new Date(value).toLocaleTimeString() }),
                React.createElement(Line, { type: "monotone", dataKey: "activeComponents", stroke: "#8884d8", name: "Active Components" }),
                React.createElement(Line, { type: "monotone", dataKey: "activeProps", stroke: "#82ca9d", name: "Active Props" }),
                React.createElement(Line, { type: "monotone", dataKey: "highUpdateProps", stroke: "#ff7300", name: "High Update Props" }))),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Current Metrics"),
            React.createElement("div", { className: styles.dataGrid },
                React.createElement("div", { className: styles.dataItem },
                    React.createElement("div", { className: styles.dataLabel }, "Components Tracked"),
                    React.createElement("div", { className: styles.dataValue, "data-testid": "component-count" }, data.components.length)),
                React.createElement("div", { className: styles.dataItem },
                    React.createElement("div", { className: styles.dataLabel }, "Props Monitored"),
                    React.createElement("div", { className: styles.dataValue, "data-testid": "props-count" }, data.components.reduce((sum, c) => sum + c.props.length, 0))),
                React.createElement("div", { className: styles.dataItem },
                    React.createElement("div", { className: styles.dataLabel }, "Frequent Updates"),
                    React.createElement("div", { className: styles.dataValue, "data-testid": "updates-count" }, data.frequentUpdates.length)))),
        warnings.length > 0 && (React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Warnings"),
            React.createElement("ul", { "data-testid": "warnings-list" }, warnings.map((warning, index) => (React.createElement("li", { key: index, className: styles.performanceLow }, warning))))))));
};
export default MonitoringDashboard;
//# sourceMappingURL=index.js.map