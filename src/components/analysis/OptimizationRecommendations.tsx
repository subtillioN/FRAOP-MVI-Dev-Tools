import React from 'react';
import { PropAnalysisResult } from '../../utils/analysis/types';
import styles from '../../styles/base.module.css';

interface Props {
  data: PropAnalysisResult;
}

const OptimizationRecommendations: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.container}>
      <h2>Optimization Recommendations</h2>
      <div className={styles.section}>
        {data.components.map(component => (
          <div key={component.componentName} className={styles['data-item']}>
            <h3>{component.componentName}</h3>
            <div>
              <strong>Props:</strong> {component.props.length}
            </div>
            <div>
              <strong>Unused Props:</strong>{' '}
              {data.unusedProps.filter(p => p.componentName === component.componentName).length}
            </div>
            <div>
              <strong>Frequent Updates:</strong>{' '}
              {data.frequentUpdates.filter(p => p.componentName === component.componentName).length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptimizationRecommendations; 