import React from 'react';
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

interface Props {
  data: PropAnalysisResult;
}

interface TimelineEvent {
  timestamp: number;
  componentName: string;
  propName: string;
  value: any;
  renderCount: number;
}

const PropTimeline: React.FC<Props> = ({ data }) => {
  const timelineData = data.components.flatMap(component =>
    component.props.map(prop => ({
      timestamp: Date.now() - (prop.valueChanges || 0) * 1000, // Approximate timestamp
      componentName: component.componentName,
      propName: prop.propName,
      value: prop.lastValue?.value,
      renderCount: prop.lastValue?.renderCount || 0
    }))
  ).sort((a, b) => a.timestamp - b.timestamp);

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload as TimelineEvent;
    return (
      <div className={styles.tooltip}>
        <p>{new Date(label).toLocaleTimeString()}</p>
        <p><strong>{data.componentName}</strong></p>
        <p>{data.propName}: {formatValue(data.value)}</p>
        <p>Render Count: {data.renderCount}</p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2>Prop Timeline</h2>

      <div className={styles['chart-container']}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timelineData}>
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
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.section}>
        <h3>Recent Updates</h3>
        <div className={styles['data-grid']}>
          {timelineData.slice(-5).map((event, index) => (
            <div key={index} className={styles['data-item']}>
              <div className={styles['data-label']}>
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
              <div>
                <strong>{event.componentName}</strong>
              </div>
              <div>
                {event.propName}: {formatValue(event.value)}
              </div>
              <div>
                Render Count: {event.renderCount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropTimeline; 