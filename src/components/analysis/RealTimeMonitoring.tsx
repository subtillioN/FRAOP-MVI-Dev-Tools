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
import { MonitoringService } from '../../services/monitoring/MonitoringService';

interface Props {
  data: PropAnalysisResult;
  monitoringService: MonitoringService;
}

interface MetricsData {
  timestamp: number;
  renderCount: number;
  averageRenderTime: number;
  totalComponents: number;
}

const RealTimeMonitoring: React.FC<Props> = ({ data, monitoringService }) => {
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const handleEvent = (event: { type: string; data?: { renderDuration?: number; message?: string } }) => {
      if (event.type === 'render' && event.data?.renderDuration !== undefined) {
        const renderDuration = event.data.renderDuration;
        setMetrics(prevMetrics => {
          const newMetric: MetricsData = {
            timestamp: Date.now(),
            renderCount: 1,
            averageRenderTime: renderDuration,
            totalComponents: 1
          };

          const newMetrics = [...prevMetrics, newMetric].slice(-60); // Keep last 60 data points
          return newMetrics;
        });
      } else if (event.type === 'warning' && event.data?.message) {
        const message = event.data.message;
        if (typeof message === 'string') {
          setAlerts(prev => [...prev, message]);
        }
      }
    };

    const unsubscribe = monitoringService.subscribe(handleEvent);

    return () => {
      unsubscribe();
    };
  }, [monitoringService]);

  useEffect(() => {
    if (data) {
      const totalRenderCount = data.components.reduce((sum, c) => 
        sum + c.props.reduce((propSum, p) => propSum + (p.valueChanges || 0), 0), 
        0
      );
      const totalComponents = data.components.length;

      if (totalComponents > 0) {
        setMetrics(prevMetrics => {
          const newMetric: MetricsData = {
            timestamp: Date.now(),
            renderCount: totalRenderCount,
            averageRenderTime: totalRenderCount / totalComponents,
            totalComponents
          };

          const newMetrics = [...prevMetrics, newMetric].slice(-60);
          return newMetrics;
        });
      }
    }
  }, [data]);

  const calculateAverageRenderTime = () => {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, metric) => acc + metric.averageRenderTime, 0);
    return Math.round(sum / metrics.length);
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
      <h2>Real-time Performance Monitoring</h2>

      <div className={styles['chart-container']}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics}>
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
              dataKey="renderCount"
              name="Render Count"
              stroke="#8884d8"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="averageRenderTime"
              name="Average Render Time (ms)"
              stroke="#82ca9d"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="totalComponents"
              name="Total Components"
              stroke="#ff7300"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.section}>
        <h3>Current Stats</h3>
        <div className={styles['data-grid']}>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Total Components</div>
            <div className={styles['data-value']}>{data.components.length}</div>
          </div>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Total Props</div>
            <div className={styles['data-value']}>
              {data.components.reduce((sum, c) => sum + c.props.length, 0)}
            </div>
          </div>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Average Render Time</div>
            <div className={styles['data-value']}>{calculateAverageRenderTime()}ms</div>
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className={styles.section}>
          <h3>Alerts</h3>
          <ul>
            {alerts.map((alert, index) => (
              <li key={index} className={styles.warning}>
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RealTimeMonitoring; 