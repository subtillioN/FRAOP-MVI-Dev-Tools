import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { MonitoringService } from '../../services/MonitoringService';
const PropValueHistory = ({ data }) => {
    const [selectedComponent, setSelectedComponent] = useState('');
    const [selectedProp, setSelectedProp] = useState('');
    const [propHistory, setPropHistory] = useState([]);
    useEffect(() => {
        const monitoringService = MonitoringService.getInstance();
        const unsubscribe = monitoringService.subscribe((event) => {
            if (event.type === 'update') {
                const analysis = event.data;
                if (selectedComponent && selectedProp) {
                    const component = analysis.components.find(c => c.componentName === selectedComponent);
                    const prop = component?.props.find(p => p.name === selectedProp);
                    if (prop?.lastValue !== undefined) {
                        setPropHistory(prev => {
                            const existingHistory = prev.find(h => h.componentName === selectedComponent && h.propName === selectedProp);
                            if (existingHistory) {
                                return prev.map(h => h.componentName === selectedComponent && h.propName === selectedProp
                                    ? {
                                        ...h,
                                        history: [...h.history, {
                                                timestamp: Date.now(),
                                                value: prop.lastValue,
                                                renderCount: prop.usageCount || 0
                                            }]
                                    }
                                    : h);
                            }
                            else {
                                return [...prev, {
                                        componentName: selectedComponent,
                                        propName: selectedProp,
                                        history: [{
                                                timestamp: Date.now(),
                                                value: prop.lastValue,
                                                renderCount: prop.usageCount || 0
                                            }]
                                    }];
                            }
                        });
                    }
                }
            }
        });
        return () => unsubscribe();
    }, [selectedComponent, selectedProp]);
    const getComponentNames = () => {
        return Array.from(new Set(data.components.map(c => c.componentName)));
    };
    const getPropNames = (componentName) => {
        const component = data.components.find(c => c.componentName === componentName);
        return component?.props.map(p => p.name) || [];
    };
    const formatValue = (value) => {
        if (value === null)
            return 'null';
        if (value === undefined)
            return 'undefined';
        if (typeof value === 'object')
            return JSON.stringify(value);
        return String(value);
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Prop Value History"),
        React.createElement("div", { className: styles.section },
            React.createElement("div", null,
                React.createElement("label", null,
                    "Component:",
                    React.createElement("select", { value: selectedComponent, onChange: e => setSelectedComponent(e.target.value) },
                        React.createElement("option", { value: "" }, "Select a component"),
                        getComponentNames().map(name => (React.createElement("option", { key: name, value: name }, name)))))),
            selectedComponent && (React.createElement("div", null,
                React.createElement("label", null,
                    "Prop:",
                    React.createElement("select", { value: selectedProp, onChange: e => setSelectedProp(e.target.value) },
                        React.createElement("option", { value: "" }, "Select a prop"),
                        getPropNames(selectedComponent).map(name => (React.createElement("option", { key: name, value: name }, name)))))))),
        selectedComponent && selectedProp && (React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Value History"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(LineChart, { width: 800, height: 400, data: propHistory
                        .find(h => h.componentName === selectedComponent && h.propName === selectedProp)
                        ?.history || [] },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "timestamp", tickFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, { labelFormatter: value => new Date(value).toLocaleTimeString(), formatter: (value) => [formatValue(value), 'Value'] }),
                    React.createElement(Line, { type: "monotone", dataKey: "renderCount", stroke: "#8884d8", name: "Render Count" }))),
            React.createElement("div", { className: styles['data-grid'] }, propHistory
                .find(h => h.componentName === selectedComponent && h.propName === selectedProp)
                ?.history.slice(-5).map((entry, index) => (React.createElement("div", { key: index, className: styles['data-item'] },
                React.createElement("div", { className: styles['data-label'] }, new Date(entry.timestamp).toLocaleTimeString()),
                React.createElement("div", { className: styles['data-value'] }, formatValue(entry.value)),
                React.createElement("div", null,
                    "Render Count: ",
                    entry.renderCount)))))))));
};
export default PropValueHistory;
//# sourceMappingURL=index.js.map