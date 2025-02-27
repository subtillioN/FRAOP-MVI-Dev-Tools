import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PropAnalysisResult } from '../../utils/propAnalysis';

interface PropTimelineProps {
  data: PropAnalysisResult;
}

export const PropTimeline: React.FC<PropTimelineProps> = ({ data }) => {
  const timelineData = data.components.flatMap(component =>
    component.props.map(prop => ({
      name: `${component.componentName}.${prop.name}`,
      time: prop.timestamps[prop.timestamps.length - 1] || 0,
      value: prop.lastValue,
      updates: prop.valueChanges || 0
    }))
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="updates" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 