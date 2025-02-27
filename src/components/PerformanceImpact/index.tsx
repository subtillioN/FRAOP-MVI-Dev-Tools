import React from 'react';
import { Treemap, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../core/PropAnalyzer';

interface PerformanceImpactProps {
  data: PropAnalysisResult;
}

interface ImpactData {
  name: string;
  value: number;
  children?: ImpactData[];
  impact: 'high' | 'medium' | 'low';
}

interface TreemapPoint {
  root: any;
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: ImpactData;
  colors: string[];
  rank: number;
  name: string;
}

const PerformanceImpact: React.FC<PerformanceImpactProps> = ({ data }) => {
  const generateImpactData = (): ImpactData[] => {
    return data.components.map(component => {
      const totalUpdates = component.props.reduce(
        (sum, prop) => sum + (prop.valueChanges || 0),
        0
      );

      const children = component.props.map(prop => ({
        name: prop.name,
        value: prop.valueChanges || 0,
        impact: getImpactLevel(prop.valueChanges || 0, prop.usageCount || 1)
      }));

      return {
        name: component.componentName,
        value: totalUpdates,
        impact: getImpactLevel(
          totalUpdates,
          component.props.reduce((sum, p) => sum + (p.usageCount || 1), 0)
        ),
        children
      };
    });
  };

  const getImpactLevel = (updates: number, renders: number): 'high' | 'medium' | 'low' => {
    const ratio = updates / renders;
    if (ratio > 0.75) return 'high';
    if (ratio > 0.5) return 'medium';
    return 'low';
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low'): string => {
    switch (impact) {
      case 'high': return '#ef5350';
      case 'medium': return '#ff9800';
      default: return '#4caf50';
    }
  };

  const renderTreemapCell = (props: TreemapPoint) => {
    const { depth, x, y, width, height, name, payload } = props;
    const impact = payload.impact;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: getImpactColor(impact),
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
          >
            {name}
          </text>
        )}
      </g>
    );
  };

  const impactData = generateImpactData();

  return (
    <div className={styles.container}>
      <h2>Performance Impact Analysis</h2>

      <div className={styles.section}>
        <h3>Component Impact Overview</h3>
        <div className={styles['chart-container']}>
          <Treemap
            width={800}
            height={400}
            data={impactData}
            dataKey="value"
            stroke="#fff"
            fill="#8884d8"
            content={renderTreemapCell}
          >
            <Tooltip 
              content={({ payload }) => {
                if (!payload?.length) return null;
                const data = payload[0].payload as ImpactData;
                return (
                  <div className={styles.tooltip}>
                    <div>{data.name}</div>
                    <div>Updates: {data.value}</div>
                    <div>Impact: {data.impact.toUpperCase()}</div>
                  </div>
                );
              }}
            />
          </Treemap>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Impact Details</h3>
        <div className={styles['data-grid']}>
          {impactData.map(component => (
            <div key={component.name} className={styles['data-item']}>
              <h4>{component.name}</h4>
              <div className={styles[`performance-${component.impact}`]}>
                Impact: {component.impact.toUpperCase()}
              </div>
              <div>
                <strong>Total Updates:</strong> {component.value}
              </div>
              {component.children && component.children.length > 0 && (
                <div>
                  <strong>Props by Impact:</strong>
                  <ul>
                    {component.children
                      .sort((a, b) => b.value - a.value)
                      .map(prop => (
                        <li key={prop.name}>
                          {prop.name}: {prop.value} updates
                          <span className={styles[`performance-${prop.impact}`]}>
                            {' '}({prop.impact})
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceImpact; 