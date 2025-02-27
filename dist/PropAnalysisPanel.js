import React, { useEffect, useState } from 'react';
import { DevToolsIntegration } from './integration';
import OptimizationRecommendations from '../components/DevTools/OptimizationRecommendations';
import RenderImpactAnalysis from '../components/DevTools/RenderImpactAnalysis';
import styles from '../styles/base.module.css';
const PropAnalysisPanel = ({ bridge }) => {
    const [analysisData, setAnalysisData] = useState(null);
    const [selectedComponentId, setSelectedComponentId] = useState(null);
    const [activeTab, setActiveTab] = useState('recommendations');
    useEffect(() => {
        const integration = DevToolsIntegration.getInstance();
        const handleAnalysisUpdate = (data) => {
            setAnalysisData(data.analysis);
        };
        const handleComponentSelect = (data) => {
            setSelectedComponentId(data.componentId);
            integration.addInspectedComponent(data.componentId);
        };
        // Subscribe to DevTools events
        bridge.on('prop-tracking:analysis-update', handleAnalysisUpdate);
        bridge.on('selectComponent', handleComponentSelect);
        return () => {
            // Cleanup subscriptions
            bridge.off('prop-tracking:analysis-update', handleAnalysisUpdate);
            bridge.off('selectComponent', handleComponentSelect);
            if (selectedComponentId) {
                integration.removeInspectedComponent(selectedComponentId);
            }
        };
    }, [bridge, selectedComponentId]);
    if (!analysisData) {
        return (React.createElement("div", { className: styles['devtools-panel'] },
            React.createElement("div", { className: styles['devtools-loading'] },
                React.createElement("p", null, "Waiting for prop analysis data..."),
                React.createElement("p", { className: styles['devtools-hint'] }, "Make sure your application is running and React DevTools is connected."))));
    }
    return (React.createElement("div", { className: styles['devtools-panel'] },
        React.createElement("div", { className: styles['devtools-header'] },
            React.createElement("h2", null, "Prop Analysis"),
            React.createElement("div", { className: styles['devtools-tabs'] },
                React.createElement("button", { className: `${styles['devtools-tab']} ${activeTab === 'recommendations' ? styles['active'] : ''}`, onClick: () => setActiveTab('recommendations') }, "Optimization Recommendations"),
                React.createElement("button", { className: `${styles['devtools-tab']} ${activeTab === 'impact' ? styles['active'] : ''}`, onClick: () => setActiveTab('impact') }, "Render Impact"))),
        React.createElement("div", { className: styles['devtools-content'] }, activeTab === 'recommendations' ? (React.createElement(OptimizationRecommendations, { data: analysisData })) : (React.createElement(RenderImpactAnalysis, { data: analysisData }))),
        selectedComponentId && (React.createElement("div", { className: styles['devtools-selected-component'] },
            React.createElement("h3", null, "Selected Component Analysis"),
            React.createElement("div", { className: styles['devtools-component-details'] }, analysisData.components
                .filter(c => c.componentName === selectedComponentId)
                .map(component => (React.createElement("div", { key: component.componentName },
                React.createElement("h4", null, component.componentName),
                React.createElement("div", { className: styles['devtools-props-list'] }, component.props.map(prop => (React.createElement("div", { key: prop.name, className: styles['devtools-prop-item'] },
                    React.createElement("span", { className: styles['devtools-prop-name'] }, prop.name),
                    React.createElement("span", { className: styles['devtools-prop-type'] }, prop.type),
                    React.createElement("span", { className: styles['devtools-prop-updates'] },
                        "Updates: ",
                        prop.valueChanges || 0)))))))))))));
};
export default PropAnalysisPanel;
//# sourceMappingURL=PropAnalysisPanel.js.map