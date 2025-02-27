import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../core/PropAnalyzer';
import { MonitoringService, MonitoringEvent } from '../../services/MonitoringService';

interface RealTimeMonitoringProps {
  data: PropAnalysisResult;
}

interface MetricsData {
  timestamp: number;
  renderCount: number;
  propUpdateCount: number;
  memoryUsage: number;
}

const RealTimeMonitoring: React.FC<RealTimeMonitoringProps> = ({ data }) => {
  const [metricsHistory, setMetricsHistory] = useState<MetricsData[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const monitoringService = MonitoringService.getInstance();
    const unsubscribe = monitoringService.subscribe((event: MonitoringEvent) => {
      if (event.type === 'update') {
        const analysis = event.data as PropAnalysisResult;
        const newMetrics = {
          timestamp: Date.now(),
          renderCount: analysis.components.reduce((sum, c) => 
            sum + c.props.reduce((p, prop) => p + (prop.usageCount || 0), 0), 0
          ),
          propUpdateCount: analysis.components.reduce((sum, c) => 
            sum + c.props.reduce((p, prop) => p + (prop.valueChanges || 0), 0), 0
          ),
          memoryUsage: performance.memory?.usedJSHeapSize || 0
        };

        setMetricsHistory(prev => {
          const newHistory = [...prev, newMetrics];
          // Keep last 60 data points (1 minute at 1s interval)
          return newHistory.slice(-60);
        });
      } else if (event.type === 'warning') {
        setAlerts(prev => [...prev, event.data.message]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Real-time Monitoring</h2>

      <div className={styles.section}>
        <h3>Performance Metrics</h3>
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
              dataKey="renderCount" 
              stroke="#8884d8" 
              name="Render Count" 
            />
            <Line 
              type="monotone" 
              dataKey="propUpdateCount" 
              stroke="#82ca9d" 
              name="Prop Updates" 
            />
            <Line 
              type="monotone" 
              dataKey="memoryUsage" 
              stroke="#ff7300" 
              name="Memory Usage (bytes)" 
            />
          </LineChart>
        </div>
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
            <div className={styles['data-label']}>Update Rate</div>
            <div className={styles['data-value']}>
              {metricsHistory.length > 1 
                ? Math.round(
                    (metricsHistory[metricsHistory.length - 1].propUpdateCount - 
                     metricsHistory[metricsHistory.length - 2].propUpdateCount) / 
                    ((metricsHistory[metricsHistory.length - 1].timestamp - 
                      metricsHistory[metricsHistory.length - 2].timestamp) / 1000)
                  ) 
                : 0} updates/s
            </div>
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className={styles.section}>
          <h3>Alerts</h3>
          <ul>
            {alerts.map((alert, index) => (
              <li key={index} className={styles['performance-low']}>
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