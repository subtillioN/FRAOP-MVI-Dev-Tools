import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../core/PropAnalyzer';

interface PropTimelineProps {
  data: PropAnalysisResult;
}

interface TimelineEvent {
  componentName: string;
  propName: string;
  timestamp: number;
  type: 'update' | 'mount' | 'unmount';
  value?: any;
}

const PropTimeline: React.FC<PropTimelineProps> = ({ data }) => {
  const generateTimelineData = (): TimelineEvent[] => {
    const timelineData = data.components.flatMap(component =>
      component.props.map(prop => ({
        componentName: component.componentName,
        propName: prop.name,
        timestamp: Date.now() - (prop.valueChanges || 0) * 1000, // Approximate timestamp
        type: 'update' as const,
        value: prop.lastValue
      }))
    );

    return timelineData.sort((a, b) => a.timestamp - b.timestamp);
  };

  const timelineData = generateTimelineData();

  return (
    <div className={styles.container}>
      <h2>Prop Timeline</h2>

      <div className={styles.section}>
        <h3>Component Updates Over Time</h3>
        <div className={styles['chart-container']}>
          <LineChart width={800} height={400} data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={value => new Date(value).toLocaleTimeString()} 
            />
            <YAxis dataKey="componentName" />
            <Tooltip 
              labelFormatter={value => new Date(value).toLocaleTimeString()}
              formatter={(value: any, name: string) => {
                if (name === 'value') {
                  if (value === null) return 'null';
                  if (value === undefined) return 'undefined';
                  if (typeof value === 'object') return JSON.stringify(value);
                  return String(value);
                }
                return value;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              name="Value" 
            />
          </LineChart>
        </div>
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
                {event.propName}: {event.value !== undefined ? String(event.value) : 'undefined'}
              </div>
              <div className={styles[`performance-${event.type}`]}>
                {event.type.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropTimeline; 