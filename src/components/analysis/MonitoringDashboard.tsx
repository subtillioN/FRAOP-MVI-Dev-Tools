import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../utils/analysis/types';
import { MonitoringService, MonitoringEvent } from '../../services/monitoring/MonitoringService';

interface Props {
  data: PropAnalysisResult;
}

interface MetricsData {
  timestamp: number;
  activeComponents: number;
  activeProps: number;
  highUpdateProps: number;
}

const MonitoringDashboard: React.FC<Props> = ({ data }) => {
  const [metricsHistory, setMetricsHistory] = useState<MetricsData[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const monitoringService = MonitoringService.getInstance();

  useEffect(() => {
    const handleEvent = (event: MonitoringEvent) => {
      if (event.type === 'update') {
        const newMetrics = calculateMetrics(data);
        setMetricsHistory(prev => {
          const newHistory = [...prev, newMetrics];
          return newHistory.slice(-60); // Keep last 60 data points
        });
      } else if (event.type === 'warning' && event.data?.message) {
        const message = event.data.message;
        if (typeof message === 'string') {
          setWarnings(prev => [...prev, message]);
        }
      }
    };

    const unsubscribe = monitoringService.subscribe(handleEvent);
    monitoringService.startMonitoring();

    return () => {
      monitoringService.stopMonitoring();
      unsubscribe();
    };
  }, [data, monitoringService]);

  const calculateMetrics = (analysis: PropAnalysisResult): MetricsData => {
    const activeComponents = analysis.components.length;
    const activeProps = analysis.components.reduce(
      (sum, component) => sum + component.props.filter(p => p.usageCount > 0).length,
      0
    );
    const highUpdateProps = analysis.components.reduce(
      (sum, component) =>
        sum +
        component.props.filter(
          p => (p.valueChanges || 0) / (p.usageCount || 1) > 0.5
        ).length,
      0
    );

    return {
      timestamp: Date.now(),
      activeComponents,
      activeProps,
      highUpdateProps
    };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className={styles.tooltip}>
        <p>{new Date(label).toLocaleTimeString()}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2>Real-time Monitoring</h2>

      <div className={styles['chart-container']}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metricsHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={value => new Date(value).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="activeComponents"
              name="Active Components"
              stroke="#8884d8"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="activeProps"
              name="Active Props"
              stroke="#82ca9d"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="highUpdateProps"
              name="High Update Props"
              stroke="#ff7300"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.section}>
        <h3>Current Metrics</h3>
        <div className={styles['data-grid']}>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Components Tracked</div>
            <div className={styles['data-value']}>
              {data.components.length}
            </div>
          </div>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Props Monitored</div>
            <div className={styles['data-value']}>
              {data.components.reduce((sum, c) => sum + c.props.length, 0)}
            </div>
          </div>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Frequent Updates</div>
            <div className={styles['data-value']}>
              {data.frequentUpdates.length}
            </div>
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className={styles.section}>
          <h3>Warnings</h3>
          <ul>
            {warnings.map((warning, index) => (
              <li key={index} className={styles.warning}>
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