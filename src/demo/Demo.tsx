import React, { useState, useEffect } from 'react';
import {
  MonitoringDashboard,
  PropPatternDetection,
  PropTimeline,
  RealTimeMonitoring,
  PerformanceImpact,
  OptimizationRecommendations
} from '../components/analysis';
import { PropAnalysisResult, Pattern as PropPattern, PropUsage, PropValue } from '../utils/analysis/types';
import { MonitoringService } from '../services/monitoring/MonitoringService';
import styles from '../styles/base.module.css';

const mockPropValue: PropValue = {
  value: null,
  timestamp: Date.now(),
  renderCount: 0
};

const mockData: PropAnalysisResult = {
  components: [
    {
      componentName: 'UserProfile',
      props: [
        {
          componentName: 'UserProfile',
          propName: 'userId',
          type: 'string',
          required: false,
          usageCount: 10,
          valueChanges: 5,
          lastValue: mockPropValue,
          valueHistory: [],
          timestamps: []
        },
        {
          componentName: 'UserProfile',
          propName: 'userData',
          type: 'object',
          required: false,
          usageCount: 10,
          valueChanges: 15,
          lastValue: mockPropValue,
          valueHistory: [],
          timestamps: []
        }
      ]
    },
    {
      componentName: 'Dashboard',
      props: [
        {
          componentName: 'Dashboard',
          propName: 'data',
          type: 'array',
          required: false,
          usageCount: 10,
          valueChanges: 20,
          lastValue: mockPropValue,
          valueHistory: [],
          timestamps: []
        },
        {
          componentName: 'Dashboard',
          propName: 'loading',
          type: 'boolean',
          required: false,
          usageCount: 10,
          valueChanges: 8,
          lastValue: mockPropValue,
          valueHistory: [],
          timestamps: []
        }
      ]
    }
  ],
  unusedProps: [
    {
      componentName: 'UserProfile',
      propName: 'theme',
      type: 'string',
      required: false,
      usageCount: 0,
      valueChanges: 0,
      lastValue: mockPropValue,
      valueHistory: [],
      timestamps: []
    },
    {
      componentName: 'Dashboard',
      propName: 'debug',
      type: 'boolean',
      required: false,
      usageCount: 0,
      valueChanges: 0,
      lastValue: mockPropValue,
      valueHistory: [],
      timestamps: []
    }
  ],
  propPatterns: [
    {
      id: 'pattern1',
      description: 'Frequent updates pattern',
      components: ['UserProfile', 'Dashboard'],
      props: ['userId', 'data'],
      confidence: 0.8
    },
    {
      id: 'pattern2',
      description: 'Value pattern',
      components: ['UserProfile', 'Dashboard'],
      props: ['userData', 'loading'],
      confidence: 0.5
    }
  ],
  frequentUpdates: [
    {
      componentName: 'Dashboard',
      propName: 'data',
      updateCount: 20,
      averageInterval: 1000
    }
  ],
  timestamp: Date.now()
};

const Demo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [data, setData] = useState<PropAnalysisResult>(mockData);
  const monitoringService = MonitoringService.getInstance();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev: PropAnalysisResult) => ({
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
        return <RealTimeMonitoring data={data} monitoringService={monitoringService} />;
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