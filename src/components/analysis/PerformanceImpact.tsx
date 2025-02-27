import React from 'react';
import {
  ResponsiveContainer,
  Treemap,
  Tooltip
} from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../utils/analysis/types';

interface Props {
  data: PropAnalysisResult;
}

interface TreemapData {
  name: string;
  size: number;
  children?: TreemapData[];
  impact?: 'high' | 'medium' | 'low';
}

const PerformanceImpact: React.FC<Props> = ({ data }) => {
  const generateTreemapData = (): TreemapData[] => {
    return data.components.map(component => {
      const totalUpdates = component.props.reduce(
        (sum, prop) => sum + (prop.valueChanges || 0),
        0
      );

      const children = component.props.map(prop => ({
        name: prop.propName,
        size: prop.valueChanges || 0,
        impact: getImpactLevel(prop.valueChanges || 0, prop.usageCount || 1)
      }));

      return {
        name: component.componentName,
        size: totalUpdates,
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
      case 'high':
        return '#ef5350';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
    }
  };

  const treemapData = generateTreemapData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload as TreemapData;
    return (
      <div className={styles.tooltip}>
        <p><strong>{data.name}</strong></p>
        <p>Updates: {data.size}</p>
        {data.impact && <p>Impact: {data.impact.toUpperCase()}</p>}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2>Performance Impact Analysis</h2>

      <div className={styles.section}>
        <h3>Component Update Impact</h3>
        <div className={styles['chart-container']}>
          <ResponsiveContainer width="100%" height={400}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Impact Details</h3>
        <div className={styles['data-grid']}>
          {treemapData.map(component => (
            <div key={component.name} className={styles['data-item']}>
              <h4>{component.name}</h4>
              <div className={styles[`impact-${component.impact}`]}>
                Impact: {component.impact?.toUpperCase()}
              </div>
              <div>
                <strong>Total Updates:</strong> {component.size}
              </div>
              {component.children && component.children.length > 0 && (
                <div>
                  <strong>Props by Impact:</strong>
                  <ul>
                    {component.children
                      .sort((a, b) => b.size - a.size)
                      .map(prop => (
                        <li key={prop.name}>
                          {prop.name}: {prop.size} updates
                          <span className={styles[`impact-${prop.impact}`]}>
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