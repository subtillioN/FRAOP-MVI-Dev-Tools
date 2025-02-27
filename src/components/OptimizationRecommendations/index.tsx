import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../core/PropAnalyzer';

interface OptimizationRecommendationsProps {
  data: PropAnalysisResult;
}

interface Suggestion {
  componentName: string;
  type: 'memoization' | 'propsGrouping' | 'stateManagement';
  impact: 'high' | 'medium' | 'low';
  description: string;
  codeExample: string;
  affectedProps: string[];
}

interface ChartDataEntry {
  name: string;
  value: number;
  impact: 'high' | 'medium' | 'low';
}

// Update Bar component to accept fill function
const CustomBar: React.FC<any> = (props) => {
  const { fill, entry, ...rest } = props;
  const fillColor = typeof fill === 'function' ? fill(entry) : fill;
  return <rect {...rest} fill={fillColor} />;
};

const getBarColor = (impact: 'high' | 'medium' | 'low'): string => {
  switch (impact) {
    case 'high': return '#ef5350';
    case 'medium': return '#ff9800';
    default: return '#4caf50';
  }
};

const OptimizationRecommendations: React.FC<OptimizationRecommendationsProps> = ({ data }) => {
  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    data.components.forEach(component => {
      // Check for memoization opportunities
      const totalUpdates = component.props.reduce(
        (sum, prop) => sum + (prop.valueChanges || 0),
        0
      );
      const averageUpdatesPerProp = totalUpdates / component.props.length;

      const frequentlyUpdatingProps = component.props.filter(
        prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.5
      );
      const stableProps = component.props.filter(
        prop => (prop.valueChanges || 0) / (prop.usageCount || 1) < 0.2
      );

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
  ${frequentlyUpdatingProps.map(p => 
    `// Only re-render if ${p.name} has changed\n  if (prevProps.${p.name} !== nextProps.${p.name}) return false;`
  ).join('\n  ')}
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
        const stateProps = component.props.filter(p =>
          p.name.match(/^(set|update|change)/i) &&
          p.type === 'function'
        );

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
      return { ...state, ${p.name.replace(/^set|Update|Change/i, '').toLowerCase()}: action.payload };`
    ).join('\n')}
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
  const chartData: ChartDataEntry[] = suggestions.map(suggestion => ({
    name: suggestion.componentName,
    value: suggestion.impact === 'high' ? 3 : suggestion.impact === 'medium' ? 2 : 1,
    impact: suggestion.impact
  }));

  return (
    <div className={styles.container}>
      <h2>Optimization Recommendations</h2>

      {suggestions.length > 0 ? (
        <>
          <div className={styles['chart-container']}>
            <BarChart width={800} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="value"
                shape={<CustomBar fill={(entry: ChartDataEntry) => getBarColor(entry.impact)} />}
              />
            </BarChart>
          </div>

          <div className={styles.section}>
            {suggestions.map((suggestion, index) => (
              <div key={index} className={styles['data-item']}>
                <h3>{suggestion.componentName}</h3>
                <div className={styles[`performance-${suggestion.impact}`]}>
                  {suggestion.impact.toUpperCase()} Impact
                </div>
                <p>{suggestion.description}</p>
                <pre>
                  <code>{suggestion.codeExample}</code>
                </pre>
                <div>
                  <strong>Affected Props:</strong>{' '}
                  {suggestion.affectedProps.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No optimization suggestions available.</p>
      )}
    </div>
  );
};

export default OptimizationRecommendations; 