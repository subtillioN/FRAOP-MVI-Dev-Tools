import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../core/PropAnalyzer';
import { MonitoringService, MonitoringEvent } from '../../services/MonitoringService';

interface MonitoringDashboardProps {
  data: PropAnalysisResult;
}

interface MetricsData {
  timestamp: number;
  activeComponents: number;
  activeProps: number;
  highUpdateProps: number;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ data }) => {
  const [metricsHistory, setMetricsHistory] = useState<MetricsData[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const monitoringService = MonitoringService.getInstance();
    const unsubscribe = monitoringService.subscribe((event: MonitoringEvent) => {
      if (event.type === 'update') {
        const analysis = event.data as PropAnalysisResult;
        const newMetrics = calculateMetrics(analysis);
        setMetricsHistory(prev => {
          const newHistory = [...prev, newMetrics];
          // Keep last 60 data points (1 minute at 1s interval)
          return newHistory.slice(-60);
        });
      } else if (event.type === 'warning') {
        setWarnings(prev => [...prev, event.data.message]);
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateMetrics = (analysis: PropAnalysisResult): MetricsData => {
    const activeComponents = analysis.components.length;
    const activeProps = analysis.components.reduce((sum, component) => 
      sum + component.props.filter(p => p.usageCount > 0).length, 0
    );
    const highUpdateProps = analysis.components.reduce((sum, component) => 
      sum + component.props.filter(p => 
        (p.valueChanges || 0) / (p.usageCount || 1) > 0.5
      ).length, 0
    );

    return {
      timestamp: Date.now(),
      activeComponents,
      activeProps,
      highUpdateProps
    };
  };

  return (
    <div className={styles.container} data-testid="monitoring-dashboard">
      <h2>Real-time Monitoring</h2>

      <div className={styles['chart-container']}>
        <LineChart width={800} height={400} data={metricsHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={value => new Date(value).toLocaleTimeString()} 
          />
          <YAxis />
          <Tooltip 
            labelFormatter={value => new Date(value).toLocaleTimeString()}
          />
          <Line 
            type="monotone" 
            dataKey="activeComponents" 
            stroke="#8884d8" 
            name="Active Components" 
          />
          <Line 
            type="monotone" 
            dataKey="activeProps" 
            stroke="#82ca9d" 
            name="Active Props" 
          />
          <Line 
            type="monotone" 
            dataKey="highUpdateProps" 
            stroke="#ff7300" 
            name="High Update Props" 
          />
        </LineChart>
      </div>

      <div className={styles.section}>
        <h3>Current Metrics</h3>
        <div className={styles['data-grid']}>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Components Tracked</div>
            <div className={styles['data-value']}>{data.components.length}</div>
          </div>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Props Monitored</div>
            <div className={styles['data-value']}>
              {data.components.reduce((sum, c) => sum + c.props.length, 0)}
            </div>
          </div>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Frequent Updates</div>
            <div className={styles['data-value']}>{data.frequentUpdates.length}</div>
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className={styles.section}>
          <h3>Warnings</h3>
          <ul>
            {warnings.map((warning, index) => (
              <li key={index} className={styles['performance-low']}>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard; 