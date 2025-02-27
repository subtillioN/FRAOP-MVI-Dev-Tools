import React, { useState, useEffect } from 'react';
import {
  MonitoringDashboard,
  PropPatternDetection,
  PropTimeline,
  RealTimeMonitoring,
  PerformanceImpact,
  OptimizationRecommendations
} from '../components';
import { PropAnalysisResult, PropPattern, PropUsage } from '../core/PropAnalyzer';
import styles from '../styles/base.module.css';

const mockData: PropAnalysisResult = {
  components: [
    {
      componentName: 'UserProfile',
      props: [
        { name: 'userId', type: 'string', valueChanges: 5, usageCount: 10 },
        { name: 'userData', type: 'object', valueChanges: 15, usageCount: 10 }
      ]
    },
    {
      componentName: 'Dashboard',
      props: [
        { name: 'data', type: 'array', valueChanges: 20, usageCount: 10 },
        { name: 'loading', type: 'boolean', valueChanges: 8, usageCount: 10 }
      ]
    }
  ],
  unusedProps: [
    { componentName: 'UserProfile', propName: 'theme' },
    { componentName: 'Dashboard', propName: 'debug' }
  ],
  propPatterns: [
    { type: 'update', frequency: 0.8 } as PropPattern,
    { type: 'value', frequency: 0.5 } as PropPattern
  ],
  frequentUpdates: [
    { componentName: 'Dashboard', propName: 'data' }
  ]
};

const Demo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [data, setData] = useState(mockData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        components: prev.components.map(component => ({
          ...component,
          props: component.props.map((prop: PropUsage) => ({
            ...prop,
            valueChanges: (prop.valueChanges || 0) + Math.floor(Math.random() * 3),
            usageCount: (prop.usageCount || 0) + 1
          }))
        }))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'monitoring':
        return <MonitoringDashboard data={data} />;
      case 'patterns':
        return <PropPatternDetection data={data} />;
      case 'timeline':
        return <PropTimeline data={data} />;
      case 'realtime':
        return <RealTimeMonitoring data={data} />;
      case 'impact':
        return <PerformanceImpact data={data} />;
      case 'optimization':
        return <OptimizationRecommendations data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1>FRAOP MVI Dev Tools Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          className={`${styles.button} ${activeTab === 'monitoring' ? styles.buttonActive : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          Monitoring Dashboard
        </button>
        <button
          className={`${styles.button} ${activeTab === 'patterns' ? styles.buttonActive : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          Pattern Detection
        </button>
        <button
          className={`${styles.button} ${activeTab === 'timeline' ? styles.buttonActive : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Prop Timeline
        </button>
        <button
          className={`${styles.button} ${activeTab === 'realtime' ? styles.buttonActive : ''}`}
          onClick={() => setActiveTab('realtime')}
        >
          Real-time Monitoring
        </button>
        <button
          className={`${styles.button} ${activeTab === 'impact' ? styles.buttonActive : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          Performance Impact
        </button>
        <button
          className={`${styles.button} ${activeTab === 'optimization' ? styles.buttonActive : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          Optimization
        </button>
      </div>

      <div className={styles.section}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Demo; 