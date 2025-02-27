import React from 'react';
import styles from '../../styles/base.module.css';
const OptimizationRecommendations = ({ data }) => {
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Optimization Recommendations"),
        React.createElement("div", { className: styles.section }, data.components.map(component => (React.createElement("div", { key: component.componentName, className: styles['data-item'] },
            React.createElement("h3", null, component.componentName),
            React.createElement("div", null,
                React.createElement("strong", null, "Props:"),
                " ",
                component.props.length),
            React.createElement("div", null,
                React.createElement("strong", null, "Unused Props:"),
                ' ',
                data.unusedProps.filter(p => p.componentName === component.componentName).length),
            React.createElement("div", null,
                React.createElement("strong", null, "Frequent Updates:"),
                ' ',
                data.frequentUpdates.filter(p => p.componentName === component.componentName).length)))))));
};
export default OptimizationRecommendations;
//# sourceMappingURL=OptimizationRecommendations.js.map