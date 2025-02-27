import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Treemap
} from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../utils/analysis/types';

interface Props {
  data: PropAnalysisResult;
}

const CodeAnalysis: React.FC<Props> = ({ data }) => {
  // Transform data for dependency visualization
  const dependencyData = {
    name: 'dependencies',
    children: data.propPatterns.map(pattern => ({
      name: pattern.description,
      size: pattern.components.length,
      children: pattern.components.map(component => ({
        name: component,
        size: 1
      }))
    }))
  };

  // Transform data for component hierarchy
  const hierarchyData = {
    name: 'components',
    children: data.components.map(component => ({
      name: component.componentName,
      size: component.props.length,
      children: component.props.map(prop => ({
        name: prop.propName,
        size: prop.valueChanges || 1
      }))
    }))
  };

  // Performance metrics data
  const performanceData = data.components.map(component => ({
    name: component.componentName,
    updates: component.props.reduce((sum, prop) => sum + (prop.valueChanges || 0), 0),
    props: component.props.length
  }));

  // Prop usage data
  const propUsageData = data.components.map(component => ({
    name: component.componentName,
    total: component.props.length,
    used: component.props.filter(p => p.usageCount > 0).length,
    unused: component.props.filter(p => p.usageCount === 0).length
  }));

  // Frequent updates data
  const frequentUpdatesData = data.frequentUpdates.map(update => ({
    name: `${update.componentName}.${update.propName}`,
    updates: update.updateCount
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className={styles.tooltip}>
        <p>{`${label}`}</p>
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
      <h2>Code Analysis</h2>

      <div className={styles.section}>
        <h3>Component Dependencies</h3>
        <div className={styles['chart-container']}>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={[dependencyData]}
              dataKey="size"
              stroke="#fff"
              fill="#8884d8"
            />
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Component Hierarchy</h3>
        <div className={styles['chart-container']}>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={[hierarchyData]}
              dataKey="size"
              stroke="#fff"
              fill="#82ca9d"
            />
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Performance Metrics</h3>
        <div className={styles['chart-container']}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="updates" name="Updates" fill="#8884d8" />
              <Bar dataKey="props" name="Props" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Prop Usage</h3>
        <div className={styles['chart-container']}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={propUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="used" name="Used Props" stackId="a" fill="#4caf50" />
              <Bar dataKey="unused" name="Unused Props" stackId="a" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Frequent Updates</h3>
        <div className={styles['chart-container']}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frequentUpdatesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="updates" name="Update Count" fill="#ff4081" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CodeAnalysis; 