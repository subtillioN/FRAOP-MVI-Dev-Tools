import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from 'recharts';
import styles from '../../styles/base.module.css';
const MemoizationSuggestions = ({ data }) => {
    const suggestions = useMemo(() => {
        const result = [];
        data.components.forEach(component => {
            // Calculate component's memoization score
            const totalProps = component.props.length;
            const frequentlyUpdatingProps = component.props.filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.5);
            const stableProps = component.props.filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) < 0.2);
            if (frequentlyUpdatingProps.length > 0) {
                const score = (frequentlyUpdatingProps.length / totalProps) * 100;
                const impact = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
                result.push({
                    componentName: component.componentName,
                    score,
                    reason: `${frequentlyUpdatingProps.length} out of ${totalProps} props update frequently`,
                    impact,
                    suggestedAction: 'Use React.memo with custom comparison for frequently updating props',
                    affectedProps: frequentlyUpdatingProps.map(p => p.propName),
                });
            }
            if (stableProps.length > totalProps * 0.7) {
                result.push({
                    componentName: component.componentName,
                    score: (stableProps.length / totalProps) * 100,
                    reason: `${stableProps.length} out of ${totalProps} props are stable`,
                    impact: 'medium',
                    suggestedAction: 'Use React.memo for component with mostly stable props',
                    affectedProps: stableProps.map(p => p.propName),
                });
            }
        });
        return result.sort((a, b) => b.score - a.score);
    }, [data]);
    const chartData = suggestions.map(s => ({
        name: s.componentName,
        value: s.score,
    }));
    const getBarColor = (impact) => {
        switch (impact) {
            case 'high':
                return '#ef5350';
            case 'medium':
                return '#ff9800';
            case 'low':
                return '#4caf50';
        }
    };
    const CustomBar = ({ x, y, width, height, impact }) => {
        const fill = getBarColor(impact);
        return React.createElement("rect", { x: x, y: y, width: width, height: height, fill: fill });
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("h2", null, "Memoization Suggestions"),
        suggestions.length > 0 ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: styles['chart-container'] },
                React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
                    React.createElement(BarChart, { data: chartData },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(XAxis, { dataKey: "name", angle: -45, textAnchor: "end", height: 70, interval: 0 }),
                        React.createElement(YAxis, { label: { value: 'Score', angle: -90, position: 'insideLeft' } }),
                        React.createElement(Tooltip, null),
                        React.createElement(Legend, null),
                        React.createElement(Bar, { dataKey: "value", name: "Memoization Score" }, chartData.map((entry, index) => (React.createElement(Cell, { key: `cell-${index}`, fill: getBarColor(suggestions[index].impact) }))))))),
            React.createElement("div", { className: styles['suggestions-list'] }, suggestions.map((suggestion, index) => (React.createElement("div", { key: index, className: `${styles['suggestion-card']} ${styles[`impact-${suggestion.impact}`]}` },
                React.createElement("h4", null, suggestion.componentName),
                React.createElement("p", { className: styles['suggestion-reason'] }, suggestion.reason),
                React.createElement("div", { className: styles['suggestion-details'] },
                    React.createElement("div", { className: styles['suggestion-impact'] },
                        React.createElement("label", null, "Impact"),
                        React.createElement("span", null, suggestion.impact)),
                    React.createElement("div", { className: styles['suggestion-score'] },
                        React.createElement("label", null, "Score"),
                        React.createElement("span", null,
                            suggestion.score.toFixed(1),
                            "%"))),
                React.createElement("div", { className: styles['suggestion-action'] },
                    React.createElement("h5", null, "Suggested Action"),
                    React.createElement("p", null, suggestion.suggestedAction)),
                React.createElement("div", { className: styles['affected-props'] },
                    React.createElement("h5", null, "Affected Props"),
                    React.createElement("ul", null, suggestion.affectedProps.map((prop, i) => (React.createElement("li", { key: i }, prop))))))))))) : (React.createElement("p", null, "No memoization suggestions found. Your components appear to be well optimized!"))));
};
export default MemoizationSuggestions;
//# sourceMappingURL=MemoizationSuggestions.js.map