import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
// Update Bar component to accept fill function
const CustomBar = (props) => {
    const { fill, entry, ...rest } = props;
    const fillColor = typeof fill === 'function' ? fill(entry) : fill;
    return React.createElement("rect", { ...rest, fill: fillColor });
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
                    React.createElement(Bar, { dataKey: "value", shape: React.createElement(CustomBar, { fill: (entry) => getBarColor(entry.impact) }) }))),
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
export default OptimizationRecommendations;
//# sourceMappingURL=index.js.map