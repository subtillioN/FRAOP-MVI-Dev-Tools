import React from 'react';
import { Treemap, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../core/PropAnalyzer';

interface RenderImpactAnalysisProps {
  data: PropAnalysisResult;
}

interface TreemapData {
  name: string;
  size: number;
  children?: TreemapData[];
}

const RenderImpactAnalysis: React.FC<RenderImpactAnalysisProps> = ({ data }) => {
  const generateTreemapData = (): TreemapData[] => {
    return data.components.map(component => {
      const totalUpdates = component.props.reduce(
        (sum, prop) => sum + (prop.valueChanges || 0),
        0
      );

      const children = component.props.map(prop => ({
        name: prop.name,
        size: prop.valueChanges || 0
      }));

      // Find components that are affected by this component's updates
      const affectedComponents = data.components
        .filter(c => c.componentName !== component.componentName)
        .filter(c => {
          const hasSharedProps = c.props.some(p => 
            component.props.some(cp => cp.name === p.name)
          );
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

  return (
    <div className={styles.container} data-testid="render-impact-analysis">
      <h2>Render Impact Analysis</h2>

      <div className={styles.section}>
        <h3>Component Update Relationships</h3>
        <div className={styles['chart-container']}>
          <Treemap
            width={800}
            height={400}
            data={treemapData}
            dataKey="size"
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip 
              content={({ payload }) => {
                if (!payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className={styles.tooltip}>
                    <div>{data.name}</div>
                    <div>Updates: {data.size}</div>
                  </div>
                );
              }}
            />
          </Treemap>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Impact Analysis</h3>
        <div className={styles['data-grid']}>
          {data.components.map(component => {
            const totalUpdates = component.props.reduce(
              (sum, prop) => sum + (prop.valueChanges || 0),
              0
            );

            const highImpactProps = component.props
              .filter(prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.5)
              .map(prop => ({
                name: prop.name,
                updateCount: prop.valueChanges || 0
              }));

            const affectedComponents = data.components
              .filter(c => c.componentName !== component.componentName)
              .filter(c => {
                const hasSharedProps = c.props.some(p => 
                  component.props.some(cp => cp.name === p.name)
                );
                return hasSharedProps;
              })
              .map(c => c.componentName);

            return (
              <div key={component.componentName} className={styles['data-item']}>
                <h4>{component.componentName}</h4>
                <div>
                  <strong>Total Updates:</strong> {totalUpdates}
                </div>
                {highImpactProps.length > 0 && (
                  <div>
                    <strong>High Impact Props:</strong>
                    <ul>
                      {highImpactProps.map(prop => (
                        <li key={prop.name}>
                          {prop.name} ({prop.updateCount} updates)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {affectedComponents.length > 0 && (
                  <div>
                    <strong>Affects Components:</strong>
                    <ul>
                      {affectedComponents.map(name => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RenderImpactAnalysis; 