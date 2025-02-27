import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../core/PropAnalyzer';

interface PropPatternDetectionProps {
  data: PropAnalysisResult;
}

interface Pattern {
  name: string;
  components: string[];
  props: string[];
  frequency: number;
  type: 'update' | 'value' | 'unused';
}

// Custom Bar component to handle dynamic fill
const CustomBar: React.FC<any> = (props) => {
  const { fill, entry, ...rest } = props;
  const fillColor = (() => {
    switch (entry.type) {
      case 'update': return '#ef5350';
      case 'value': return '#4caf50';
      default: return '#ff9800';
    }
  })();
  return <rect {...rest} fill={fillColor} />;
};

const PropPatternDetection: React.FC<PropPatternDetectionProps> = ({ data }) => {
  const detectPatterns = (): Pattern[] => {
    const patterns: Pattern[] = [];

    // Detect frequent update patterns
    const frequentUpdates = data.components.flatMap(component =>
      component.props
        .filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.7)
        .map(prop => ({
          componentName: component.componentName,
          propName: prop.name,
          updateCount: prop.valueChanges || 0
        }))
    );

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
    const propDependencies = new Map<string, Set<string>>();
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
                propDependencies.get(propKey)!.add(
                  `${otherComponent.componentName}.${otherProp.name}`
                );
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

  return (
    <div className={styles.container}>
      <h2>Prop Pattern Detection</h2>

      <div className={styles.section}>
        <h3>Detected Patterns</h3>
        <div className={styles['chart-container']}>
          <BarChart width={800} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="value"
              shape={<CustomBar />}
            />
          </BarChart>
        </div>
      </div>

      <div className={styles.section}>
        {patterns.map((pattern, index) => (
          <div key={index} className={styles['data-item']}>
            <h3>{pattern.name}</h3>
            <div>
              <strong>Frequency:</strong> {pattern.frequency}
            </div>
            <div>
              <strong>Affected Components:</strong>
              <ul>
                {pattern.components.map(component => (
                  <li key={component}>{component}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Affected Props:</strong>
              <ul>
                {pattern.props.map(prop => (
                  <li key={prop}>{prop}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropPatternDetection; 