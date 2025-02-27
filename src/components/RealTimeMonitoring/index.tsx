import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../utils/propAnalysis';
import { MonitoringService } from '../../services/MonitoringService';

interface MonitoringEvent {
  type: 'prop-update' | 'render' | 'error' | 'update' | 'warning';
  componentName: string;
  timestamp: number;
  data?: {
    propName?: string;
    propValue?: any;
    renderDuration?: number;
    error?: Error;
    message?: string;
  };
}

interface MetricsData {
  timestamp: number;
  renderCount: number;
  averageRenderTime: number;
  totalComponents: number;
}

interface Props {
  monitoringService: MonitoringService;
  data?: PropAnalysisResult;
}

const RealTimeMonitoring: React.FC<Props> = ({ monitoringService, data }) => {
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<MetricsData[]>([]);

  useEffect(() => {
    const unsubscribe = monitoringService.subscribe((event: MonitoringEvent) => {
      if (event.type === 'update') {
        setEvents(prevEvents => [...prevEvents, event].slice(-100)); // Keep last 100 events
      } else if (event.type === 'warning' && event.data?.message) {
        const message = event.data.message;
        if (message) {
          setAlerts(prev => [...prev, message]);
        }
      }

      // Update metrics
      if (event.type === 'render' && event.data?.renderDuration !== undefined) {
        const renderDuration = event.data.renderDuration;
        setMetrics(prevMetrics => {
          const newMetric: MetricsData = {
            timestamp: event.timestamp,
            renderCount: 1,
            averageRenderTime: renderDuration,
            totalComponents: 1
          };

          const newMetrics = [...prevMetrics, newMetric].slice(-60); // Keep last 60 data points
          return newMetrics;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [monitoringService]);

  useEffect(() => {
    if (data) {
      const totalRenderCount = data.components.reduce((sum: number, c) => sum + c.renderCount, 0);
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

  const renderEventDetails = (event: MonitoringEvent) => {
    switch (event.type) {
      case 'prop-update':
        return (
          <div>
            <strong>Prop Update:</strong> {event.componentName}.{event.data?.propName} ={' '}
            {JSON.stringify(event.data?.propValue)}
          </div>
        );
      case 'render':
        return (
          <div>
            <strong>Render:</strong> {event.componentName} ({event.data?.renderDuration}ms)
          </div>
        );
      case 'error':
        return (
          <div>
            <strong>Error:</strong> {event.componentName} - {event.data?.error?.message}
          </div>
        );
      case 'update':
        return (
          <div>
            <strong>Update:</strong> {event.componentName} - {event.data?.message}
          </div>
        );
      case 'warning':
        return (
          <div>
            <strong>Warning:</strong> {event.componentName} - {event.data?.message}
          </div>
        );
      default:
        return null;
    }
  };

  const calculateAverageRenderTime = () => {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc: number, metric: MetricsData) => acc + metric.averageRenderTime, 0);
    return Math.round(sum / metrics.length);
  };

  return (
    <div className={styles.container}>
      <h2>Real-time Monitoring</h2>

      <div className={styles.section}>
        <h3>Performance Metrics</h3>
        <div className={styles['chart-container']}>
          <LineChart width={800} height={400} data={metrics}>
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
              dataKey="averageRenderTime" 
              stroke="#82ca9d" 
              name="Average Render Time (ms)" 
            />
            <Line 
              type="monotone" 
              dataKey="totalComponents" 
              stroke="#ff7300" 
              name="Total Components" 
            />
          </LineChart>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Current Stats</h3>
        <div className={styles['data-grid']}>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Total Components</div>
            <div className={styles['data-value']}>{data?.components.length}</div>
          </div>
          <div className={styles['data-item']}>
            <div className={styles['data-label']}>Total Props</div>
            <div className={styles['data-value']}>
              {data?.components.reduce((sum, c) => sum + c.props.length, 0)}
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
              <li key={index} className={styles['performance-low']}>
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.section}>
        <h3>Real-Time Events</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {events.map((event, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <div>
                <small>{new Date(event.timestamp).toLocaleTimeString()}</small>
              </div>
              {renderEventDetails(event)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring; 