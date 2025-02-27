import React, { useState, useEffect } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar, Treemap } from 'recharts';

class PropAnalyzer {
    constructor() { }
    static getInstance() {
        if (!PropAnalyzer.instance) {
            PropAnalyzer.instance = new PropAnalyzer();
        }
        return PropAnalyzer.instance;
    }
    analyze() {
        // Implementation will be added later
        return {
            components: [],
            unusedProps: [],
            propPatterns: [],
            frequentUpdates: []
        };
    }
}

class MonitoringService {
    constructor() {
        this.analyzer = new PropAnalyzer();
        this.listeners = new Set();
        this.updateInterval = 1000; // 1 second default
    }
    static getInstance() {
        if (!MonitoringService.instance) {
            MonitoringService.instance = new MonitoringService();
        }
        return MonitoringService.instance;
    }
    startMonitoring(interval) {
        if (interval) {
            this.updateInterval = interval;
        }
        if (this.intervalId) {
            this.stopMonitoring();
        }
        this.intervalId = window.setInterval(() => {
            try {
                const analysis = this.analyzer.analyzeProps();
                this.notifyListeners({
                    type: 'update',
                    timestamp: Date.now(),
                    data: analysis
                });
                this.checkForWarnings(analysis);
            }
            catch (error) {
                this.notifyListeners({
                    type: 'error',
                    timestamp: Date.now(),
                    data: error
                });
            }
        }, this.updateInterval);
    }
    stopMonitoring() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    getAnalyzer() {
        return this.analyzer;
    }
    notifyListeners(event) {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            }
            catch (error) {
                console.error('Error in monitoring listener:', error);
            }
        });
    }
    checkForWarnings(analysis) {
        // Check for frequent updates
        const highFrequencyUpdates = analysis.frequentUpdates.filter(update => update.updateCount > 100);
        if (highFrequencyUpdates.length > 0) {
            this.notifyListeners({
                type: 'warning',
                timestamp: Date.now(),
                data: {
                    message: 'High frequency prop updates detected',
                    components: highFrequencyUpdates
                }
            });
        }
        // Check for unused props
        if (analysis.unusedProps.length > 0) {
            this.notifyListeners({
                type: 'warning',
                timestamp: Date.now(),
                data: {
                    message: 'Unused props detected',
                    components: analysis.unusedProps
                }
            });
        }
        // Check for components with many props
        const componentsWithManyProps = analysis.components.filter(component => component.props.length > 10);
        if (componentsWithManyProps.length > 0) {
            this.notifyListeners({
                type: 'warning',
                timestamp: Date.now(),
                data: {
                    message: 'Components with many props detected',
                    components: componentsWithManyProps.map(c => ({
                        name: c.componentName,
                        propCount: c.props.length
                    }))
                }
            });
        }
    }
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/* Base styles */\n.base-module_container__N-VTj {\n  padding: 20px;\n  background-color: #ffffff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  margin-bottom: 20px;\n}\n\n/* Node types */\n.base-module_node-component__3R2-B {\n  fill: #4caf50;\n}\n\n.base-module_node-prop__6bpoO {\n  fill: #2196f3;\n}\n\n/* Link types */\n.base-module_link-dependency__t58B6 {\n  stroke: #666;\n  stroke-opacity: 0.6;\n}\n\n.base-module_link-update__fj1Pw {\n  stroke: #f44336;\n  stroke-opacity: 0.6;\n}\n\n/* Chart elements */\n.base-module_chartContainer__lcs0d {\n  margin: 20px 0;\n  padding: 15px;\n  background-color: #f8f9fa;\n  border-radius: 4px;\n}\n\n.base-module_tooltip__c9I89 {\n  background-color: #fff;\n  padding: 10px;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n\n/* Performance indicators */\n.base-module_performanceHigh__Hnxwi {\n  color: #ef5350;\n  font-weight: bold;\n}\n\n.base-module_performanceMedium__jYlB7 {\n  color: #ff9800;\n  font-weight: bold;\n}\n\n.base-module_performanceLow__RWfP- {\n  color: #4caf50;\n  font-weight: bold;\n}\n\n/* Component sections */\n.base-module_section__l0hua {\n  margin-top: 20px;\n  padding: 15px;\n  border: 1px solid #e0e0e0;\n  border-radius: 4px;\n}\n\n.base-module_section-title__GYBoP {\n  font-size: 18px;\n  font-weight: 500;\n  margin-bottom: 10px;\n}\n\n.base-module_section-content__s8HOk {\n  padding: 10px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n}\n\n/* Interactive elements */\n.base-module_button__yooH5 {\n  padding: 8px 16px;\n  margin: 0 8px;\n  border: none;\n  border-radius: 4px;\n  background-color: #007bff;\n  color: white;\n  cursor: pointer;\n  font-size: 14px;\n  transition: background-color 0.2s;\n}\n\n.base-module_button__yooH5:hover {\n  background-color: #0056b3;\n}\n\n.base-module_button__yooH5:active {\n  background-color: #004085;\n}\n\n.base-module_buttonActive__yBKXk {\n  background-color: #0056b3;\n  font-weight: bold;\n}\n\n/* Data display */\n.base-module_dataGrid__cMCBW {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 15px;\n  margin-top: 15px;\n}\n\n.base-module_dataItem__S-ukG {\n  padding: 15px;\n  background-color: #f8f9fa;\n  border-radius: 4px;\n  border: 1px solid #e0e0e0;\n}\n\n.base-module_dataLabel__-otSE {\n  font-size: 14px;\n  color: #666;\n  margin-bottom: 5px;\n}\n\n.base-module_dataValue__wYuSW {\n  font-size: 24px;\n  font-weight: bold;\n  color: #333;\n}\n\n/* Responsive design */\n@media (max-width: 768px) {\n  .base-module_container__N-VTj {\n    padding: 12px;\n  }\n\n  .base-module_dataGrid__cMCBW {\n    grid-template-columns: 1fr;\n  }\n\n  .base-module_chartContainer__lcs0d {\n    height: 300px;\n  }\n} ";
var styles = {"container":"base-module_container__N-VTj","node-component":"base-module_node-component__3R2-B","node-prop":"base-module_node-prop__6bpoO","link-dependency":"base-module_link-dependency__t58B6","link-update":"base-module_link-update__fj1Pw","chartContainer":"base-module_chartContainer__lcs0d","tooltip":"base-module_tooltip__c9I89","performanceHigh":"base-module_performanceHigh__Hnxwi","performanceMedium":"base-module_performanceMedium__jYlB7","performanceLow":"base-module_performanceLow__RWfP-","section":"base-module_section__l0hua","section-title":"base-module_section-title__GYBoP","section-content":"base-module_section-content__s8HOk","button":"base-module_button__yooH5","buttonActive":"base-module_buttonActive__yBKXk","dataGrid":"base-module_dataGrid__cMCBW","dataItem":"base-module_dataItem__S-ukG","dataLabel":"base-module_dataLabel__-otSE","dataValue":"base-module_dataValue__wYuSW"};
styleInject(css_248z);

const MonitoringDashboard = ({ data }) => {
    const [metricsHistory, setMetricsHistory] = useState([]);
    const [warnings, setWarnings] = useState([]);
    useEffect(() => {
        const monitoringService = MonitoringService.getInstance();
        const unsubscribe = monitoringService.subscribe((event) => {
            if (event.type === 'update') {
                const analysis = event.data;
                const newMetrics = calculateMetrics(analysis);
                setMetricsHistory(prev => {
                    const newHistory = [...prev, newMetrics];
                    // Keep last 60 data points (1 minute at 1s interval)
                    return newHistory.slice(-60);
                });
            }
            else if (event.type === 'warning') {
                setWarnings(prev => [...prev, event.data.message]);
            }
        });
        return () => unsubscribe();
    }, []);
    const calculateMetrics = (analysis) => {
        const activeComponents = analysis.components.length;
        const activeProps = analysis.components.reduce((sum, component) => sum + component.props.filter(p => p.usageCount > 0).length, 0);
        const highUpdateProps = analysis.components.reduce((sum, component) => sum + component.props.filter(p => (p.valueChanges || 0) / (p.usageCount || 1) > 0.5).length, 0);
        return {
            timestamp: Date.now(),
            activeComponents,
            activeProps,
            highUpdateProps
        };
    };
    return (React.createElement("div", { className: styles.container, "data-testid": "monitoring-dashboard" },
        React.createElement("h2", null, "Real-time Monitoring"),
        React.createElement("div", { className: styles['chart-container'] },
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
            React.createElement("div", { className: styles['data-grid'] },
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Components Tracked"),
                    React.createElement("div", { className: styles['data-value'], "data-testid": "component-count" }, data.components.length)),
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Props Monitored"),
                    React.createElement("div", { className: styles['data-value'], "data-testid": "props-count" }, data.components.reduce((sum, c) => sum + c.props.length, 0))),
                React.createElement("div", { className: styles['data-item'] },
                    React.createElement("div", { className: styles['data-label'] }, "Frequent Updates"),
                    React.createElement("div", { className: styles['data-value'], "data-testid": "updates-count" }, data.frequentUpdates.length)))),
        warnings.length > 0 && (React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Warnings"),
            React.createElement("ul", { "data-testid": "warnings-list" }, warnings.map((warning, index) => (React.createElement("li", { key: index, className: styles['performance-low'] }, warning))))))));
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

// Update Bar component to accept fill function
const CustomBar$1 = (props) => {
    const { fill, entry } = props, rest = __rest(props, ["fill", "entry"]);
    const fillColor = typeof fill === 'function' ? fill(entry) : fill;
    return React.createElement("rect", Object.assign({}, rest, { fill: fillColor }));
};
const getBarColor = (impact) => {
    switch (impact) {
        case 'high': return '#ef5350';
        case 'medium': return '#ff9800';
        default: return '#4caf50';
    }
};
const OptimizationRecommendations = ({ data }) => {
    const generateSuggestions = () => {
        const suggestions = [];
        data.components.forEach(component => {
            // Check for memoization opportunities
            const totalUpdates = component.props.reduce((sum, prop) => sum + (prop.valueChanges || 0), 0);
            const averageUpdatesPerProp = totalUpdates / component.props.length;
            const frequentlyUpdatingProps = component.props.filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.5);
            const stableProps = component.props.filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) < 0.2);
            if (frequentlyUpdatingProps.length > 0 && stableProps.length > 0) {
                suggestions.push({
                    componentName: component.componentName,
                    type: 'memoization',
                    impact: 'high',
                    description: `Consider using React.memo with a custom comparison function to prevent unnecessary re-renders. ${stableProps.length} props are stable while ${frequentlyUpdatingProps.length} props update frequently.`,
                    codeExample: `
const ${component.componentName} = React.memo(({ ${frequentlyUpdatingProps.map(p => p.name).join(', ')} }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  ${frequentlyUpdatingProps.map(p => `// Only re-render if ${p.name} has changed\n  if (prevProps.${p.name} !== nextProps.${p.name}) return false;`).join('\n  ')}
  return true;
});`,
                    affectedProps: frequentlyUpdatingProps.map(p => p.name),
                });
            }
            // Check for props grouping opportunities
            if (component.props.length > 5) {
                const groupableProps = component.props.filter(p => p.type === 'object' || p.type === 'array');
                if (groupableProps.length >= 3) {
                    suggestions.push({
                        componentName: component.componentName,
                        type: 'propsGrouping',
                        impact: 'medium',
                        description: `Consider grouping related props into a single object prop to improve maintainability and reduce prop drilling.`,
                        codeExample: `
// Before
interface ${component.componentName}Props {
  ${groupableProps.map(p => `${p.name}: ${p.type};`).join('\n  ')}
}

// After
interface ${component.componentName}Config {
  ${groupableProps.map(p => `${p.name}: ${p.type};`).join('\n  ')}
}

interface ${component.componentName}Props {
  config: ${component.componentName}Config;
}`,
                        affectedProps: groupableProps.map(p => p.name),
                    });
                }
            }
            // Check for state management opportunities
            if (averageUpdatesPerProp > 5) {
                const stateProps = component.props.filter(p => p.name.match(/^(set|update|change)/i) &&
                    p.type === 'function');
                if (stateProps.length >= 2) {
                    suggestions.push({
                        componentName: component.componentName,
                        type: 'stateManagement',
                        impact: 'medium',
                        description: `Consider using a reducer to manage related state updates and improve state management predictability.`,
                        codeExample: `
interface ${component.componentName}State {
  ${stateProps.map(p => `${p.name.replace(/^set|Update|Change/i, '').toLowerCase()}: any;`).join('\n  ')}
}

type ${component.componentName}Action = 
  ${stateProps.map(p => `| { type: '${p.name.replace(/^set|Update|Change/i, '')}'; payload: any }`).join('\n  ')};

function ${component.componentName.toLowerCase()}Reducer(
  state: ${component.componentName}State,
  action: ${component.componentName}Action
): ${component.componentName}State {
  switch (action.type) {
    ${stateProps.map(p => `
    case '${p.name.replace(/^set|Update|Change/i, '')}':
      return { ...state, ${p.name.replace(/^set|Update|Change/i, '').toLowerCase()}: action.payload };`).join('\n')}
    default:
      return state;
  }
}`,
                        affectedProps: stateProps.map(p => p.name),
                    });
                }
            }
        });
        return suggestions;
    };
    const suggestions = generateSuggestions();
    const chartData = suggestions.map(suggestion => ({
        name: suggestion.componentName,
        value: suggestion.impact === 'high' ? 3 : suggestion.impact === 'medium' ? 2 : 1,
        impact: suggestion.impact
    }));
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Optimization Recommendations"),
        suggestions.length > 0 ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(BarChart, { width: 800, height: 300, data: chartData },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "name" }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, null),
                    React.createElement(Bar, { dataKey: "value", shape: React.createElement(CustomBar$1, { fill: (entry) => getBarColor(entry.impact) }) }))),
            React.createElement("div", { className: styles.section }, suggestions.map((suggestion, index) => (React.createElement("div", { key: index, className: styles['data-item'] },
                React.createElement("h3", null, suggestion.componentName),
                React.createElement("div", { className: styles[`performance-${suggestion.impact}`] },
                    suggestion.impact.toUpperCase(),
                    " Impact"),
                React.createElement("p", null, suggestion.description),
                React.createElement("pre", null,
                    React.createElement("code", null, suggestion.codeExample)),
                React.createElement("div", null,
                    React.createElement("strong", null, "Affected Props:"),
                    ' ',
                    suggestion.affectedProps.join(', ')))))))) : (React.createElement("p", null, "No optimization suggestions available."))));
};

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
                            if (!(payload === null || payload === void 0 ? void 0 : payload.length))
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

const PropValueHistory = ({ data }) => {
    var _a, _b;
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
                    const prop = component === null || component === void 0 ? void 0 : component.props.find(p => p.name === selectedProp);
                    if ((prop === null || prop === void 0 ? void 0 : prop.lastValue) !== undefined) {
                        setPropHistory(prev => {
                            const existingHistory = prev.find(h => h.componentName === selectedComponent && h.propName === selectedProp);
                            if (existingHistory) {
                                return prev.map(h => h.componentName === selectedComponent && h.propName === selectedProp
                                    ? Object.assign(Object.assign({}, h), { history: [...h.history, {
                                                timestamp: Date.now(),
                                                value: prop.lastValue,
                                                renderCount: prop.usageCount || 0
                                            }] }) : h);
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
        return (component === null || component === void 0 ? void 0 : component.props.map(p => p.name)) || [];
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
                React.createElement(LineChart, { width: 800, height: 400, data: ((_a = propHistory
                        .find(h => h.componentName === selectedComponent && h.propName === selectedProp)) === null || _a === void 0 ? void 0 : _a.history) || [] },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "timestamp", tickFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, { labelFormatter: value => new Date(value).toLocaleTimeString(), formatter: (value) => [formatValue(value), 'Value'] }),
                    React.createElement(Line, { type: "monotone", dataKey: "renderCount", stroke: "#8884d8", name: "Render Count" }))),
            React.createElement("div", { className: styles['data-grid'] }, (_b = propHistory
                .find(h => h.componentName === selectedComponent && h.propName === selectedProp)) === null || _b === void 0 ? void 0 : _b.history.slice(-5).map((entry, index) => (React.createElement("div", { key: index, className: styles['data-item'] },
                React.createElement("div", { className: styles['data-label'] }, new Date(entry.timestamp).toLocaleTimeString()),
                React.createElement("div", { className: styles['data-value'] }, formatValue(entry.value)),
                React.createElement("div", null,
                    "Render Count: ",
                    entry.renderCount)))))))));
};

// Custom Bar component to handle dynamic fill
const CustomBar = (props) => {
    const { fill, entry } = props, rest = __rest(props, ["fill", "entry"]);
    const fillColor = (() => {
        switch (entry.type) {
            case 'update': return '#ef5350';
            case 'value': return '#4caf50';
            default: return '#ff9800';
        }
    })();
    return React.createElement("rect", Object.assign({}, rest, { fill: fillColor }));
};
const PropPatternDetection = ({ data }) => {
    const detectPatterns = () => {
        const patterns = [];
        // Detect frequent update patterns
        const frequentUpdates = data.components.flatMap(component => component.props
            .filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.7)
            .map(prop => ({
            componentName: component.componentName,
            propName: prop.name,
            updateCount: prop.valueChanges || 0
        })));
        if (frequentUpdates.length > 0) {
            patterns.push({
                name: 'Frequent Updates',
                components: [...new Set(frequentUpdates.map(u => u.componentName))],
                props: frequentUpdates.map(u => `${u.componentName}.${u.propName}`),
                frequency: frequentUpdates.length,
                type: 'update'
            });
        }
        // Detect unused props pattern
        if (data.unusedProps.length > 0) {
            patterns.push({
                name: 'Unused Props',
                components: [...new Set(data.unusedProps.map(p => p.componentName))],
                props: data.unusedProps.map(p => `${p.componentName}.${p.propName}`),
                frequency: data.unusedProps.length,
                type: 'unused'
            });
        }
        // Detect prop dependencies
        const propDependencies = new Map();
        data.components.forEach(component => {
            component.props.forEach(prop => {
                const propKey = `${component.componentName}.${prop.name}`;
                if (!propDependencies.has(propKey)) {
                    propDependencies.set(propKey, new Set());
                }
                // Find other props that change when this prop changes
                data.components.forEach(otherComponent => {
                    otherComponent.props.forEach(otherProp => {
                        if (prop.valueChanges && otherProp.valueChanges) {
                            const correlation = Math.abs(prop.valueChanges - otherProp.valueChanges) / prop.valueChanges;
                            if (correlation < 0.2) {
                                propDependencies.get(propKey).add(`${otherComponent.componentName}.${otherProp.name}`);
                            }
                        }
                    });
                });
            });
        });
        // Add dependency patterns
        if (propDependencies.size > 0) {
            patterns.push({
                name: 'Prop Dependencies',
                components: [...new Set([...propDependencies.keys()].map(k => k.split('.')[0]))],
                props: [...propDependencies.keys()],
                frequency: propDependencies.size,
                type: 'value'
            });
        }
        return patterns;
    };
    const patterns = detectPatterns();
    const chartData = patterns.map(pattern => ({
        name: pattern.name,
        value: pattern.frequency,
        type: pattern.type
    }));
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Prop Pattern Detection"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Detected Patterns"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(BarChart, { width: 800, height: 300, data: chartData },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "name" }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, null),
                    React.createElement(Bar, { dataKey: "value", shape: React.createElement(CustomBar, null) })))),
        React.createElement("div", { className: styles.section }, patterns.map((pattern, index) => (React.createElement("div", { key: index, className: styles['data-item'] },
            React.createElement("h3", null, pattern.name),
            React.createElement("div", null,
                React.createElement("strong", null, "Frequency:"),
                " ",
                pattern.frequency),
            React.createElement("div", null,
                React.createElement("strong", null, "Affected Components:"),
                React.createElement("ul", null, pattern.components.map(component => (React.createElement("li", { key: component }, component))))),
            React.createElement("div", null,
                React.createElement("strong", null, "Affected Props:"),
                React.createElement("ul", null, pattern.props.map(prop => (React.createElement("li", { key: prop }, prop)))))))))));
};

const PropTimeline = ({ data }) => {
    const generateTimelineData = () => {
        const timelineData = data.components.flatMap(component => component.props.map(prop => ({
            componentName: component.componentName,
            propName: prop.name,
            timestamp: Date.now() - (prop.valueChanges || 0) * 1000,
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

const RealTimeMonitoring = ({ data }) => {
    const [metricsHistory, setMetricsHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        const monitoringService = MonitoringService.getInstance();
        const unsubscribe = monitoringService.subscribe((event) => {
            var _a;
            if (event.type === 'update') {
                const analysis = event.data;
                const newMetrics = {
                    timestamp: Date.now(),
                    renderCount: analysis.components.reduce((sum, c) => sum + c.props.reduce((p, prop) => p + (prop.usageCount || 0), 0), 0),
                    propUpdateCount: analysis.components.reduce((sum, c) => sum + c.props.reduce((p, prop) => p + (prop.valueChanges || 0), 0), 0),
                    memoryUsage: ((_a = performance.memory) === null || _a === void 0 ? void 0 : _a.usedJSHeapSize) || 0
                };
                setMetricsHistory(prev => {
                    const newHistory = [...prev, newMetrics];
                    // Keep last 60 data points (1 minute at 1s interval)
                    return newHistory.slice(-60);
                });
            }
            else if (event.type === 'warning') {
                setAlerts(prev => [...prev, event.data.message]);
            }
        });
        return () => unsubscribe();
    }, []);
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Real-time Monitoring"),
        React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Performance Metrics"),
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(LineChart, { width: 800, height: 400, data: metricsHistory },
                    React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                    React.createElement(XAxis, { dataKey: "timestamp", tickFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, { labelFormatter: value => new Date(value).toLocaleTimeString() }),
                    React.createElement(Line, { type: "monotone", dataKey: "renderCount", stroke: "#8884d8", name: "Render Count" }),
                    React.createElement(Line, { type: "monotone", dataKey: "propUpdateCount", stroke: "#82ca9d", name: "Prop Updates" }),
                    React.createElement(Line, { type: "monotone", dataKey: "memoryUsage", stroke: "#ff7300", name: "Memory Usage (bytes)" })))),
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
                    React.createElement("div", { className: styles['data-label'] }, "Update Rate"),
                    React.createElement("div", { className: styles['data-value'] },
                        metricsHistory.length > 1
                            ? Math.round((metricsHistory[metricsHistory.length - 1].propUpdateCount -
                                metricsHistory[metricsHistory.length - 2].propUpdateCount) /
                                ((metricsHistory[metricsHistory.length - 1].timestamp -
                                    metricsHistory[metricsHistory.length - 2].timestamp) / 1000))
                            : 0,
                        " updates/s")))),
        alerts.length > 0 && (React.createElement("div", { className: styles.section },
            React.createElement("h3", null, "Alerts"),
            React.createElement("ul", null, alerts.map((alert, index) => (React.createElement("li", { key: index, className: styles['performance-low'] }, alert))))))));
};

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
                            if (!(payload === null || payload === void 0 ? void 0 : payload.length))
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

// Core functionality
// Initialization
function initDevTools(config) {
    if (process.env.NODE_ENV !== 'development') {
        return;
    }
    const { target, features = ['monitoring', 'optimization', 'analysis'], theme = 'light', position = { x: 0, y: 0 } } = config;
    // Initialize monitoring service
    const monitoringService = MonitoringService.getInstance();
    monitoringService.startMonitoring();
    // Create container
    const container = document.createElement('div');
    container.id = 'fraop-dev-tools';
    container.style.position = 'fixed';
    container.style.top = `${position.y}px`;
    container.style.right = `${position.x}px`;
    container.style.zIndex = '9999';
    container.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    container.style.borderRadius = '4px';
    container.style.padding = '16px';
    container.style.width = '400px';
    container.style.height = '600px';
    container.style.overflow = 'auto';
    // Add theme class
    container.classList.add(`fraop-theme-${theme}`);
    // Initialize features
    if (features.includes('monitoring')) {
        const dashboard = document.createElement('div');
        dashboard.id = 'fraop-monitoring-dashboard';
        container.appendChild(dashboard);
    }
    // Mount container
    target.appendChild(container);
    // Initialize plugins
    if (config.plugins) {
        config.plugins.forEach(plugin => {
            var _a;
            try {
                (_a = plugin.init) === null || _a === void 0 ? void 0 : _a.call(plugin);
            }
            catch (error) {
                console.error(`Failed to initialize plugin: ${plugin.name}`, error);
            }
        });
    }
    console.log('Dev tools initialized with config:', config);
}

export { MonitoringDashboard, MonitoringService, OptimizationRecommendations, PerformanceImpact, PropAnalyzer, PropPatternDetection, PropTimeline, PropValueHistory, RealTimeMonitoring, RenderImpactAnalysis, initDevTools };
//# sourceMappingURL=index.esm.js.map
