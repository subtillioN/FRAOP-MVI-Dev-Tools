import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../utils/propAnalysis';

interface MemoizationSuggestionsProps {
  data: PropAnalysisResult;
}

interface MemoizationSuggestion {
  componentName: string;
  score: number;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  suggestedAction: string;
  affectedProps: string[];
}

interface ChartData {
  name: string;
  value: number;
}

interface Props {
  data: PropAnalysisResult;
}

interface MemoizationImpact {
  componentName: string;
  renderCount: number;
  impact: 'high' | 'medium' | 'low';
}

interface CustomBarProps {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
  impact: 'high' | 'medium' | 'low';
}

const MemoizationSuggestions: React.FC<Props> = ({ data }) => {
  const impactData = React.useMemo(() => {
    return data.components.map(component => {
      const renderCount = component.renderCount;
      let impact: 'high' | 'medium' | 'low' = 'low';

      if (renderCount > 100) {
        impact = 'high';
      } else if (renderCount > 50) {
        impact = 'medium';
      }

      return {
        componentName: component.componentName,
        renderCount,
        impact
      };
    });
  }, [data]);

  const CustomBar: React.FC<CustomBarProps> = React.memo(({ x, y, width, height, impact }) => {
    const fill = React.useMemo(() => {
      switch (impact) {
        case 'high':
          return '#ef5350';
        case 'medium':
          return '#ff9800';
        case 'low':
          return '#4caf50';
      }
    }, [impact]);

    return <rect x={x} y={y} width={width} height={height} fill={fill} />;
  });

  const suggestions = useMemo(() => {
    const result: MemoizationSuggestion[] = [];

    data.components.forEach(component => {
      // Calculate component's memoization score
      const totalProps = component.props.length;
      const frequentlyUpdatingProps = component.props.filter(
        prop => (prop.valueChanges || 0) / (prop.usageCount || 1) > 0.5
      );
      const stableProps = component.props.filter(
        prop => (prop.valueChanges || 0) / (prop.usageCount || 1) < 0.2
      );

      if (frequentlyUpdatingProps.length > 0) {
        const score = (frequentlyUpdatingProps.length / totalProps) * 100;
        const impact = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';

        result.push({
          componentName: component.componentName,
          score,
          reason: `${frequentlyUpdatingProps.length} out of ${totalProps} props update frequently`,
          impact,
          suggestedAction: 'Use React.memo with custom comparison for frequently updating props',
          affectedProps: frequentlyUpdatingProps.map(p => p.name),
        });
      }

      if (stableProps.length > totalProps * 0.7) {
        result.push({
          componentName: component.componentName,
          score: (stableProps.length / totalProps) * 100,
          reason: `${stableProps.length} out of ${totalProps} props are stable`,
          impact: 'medium',
          suggestedAction: 'Use React.memo for component with mostly stable props',
          affectedProps: stableProps.map(p => p.name),
        });
      }
    });

    // Sort by score descending
    return result.sort((a, b) => b.score - a.score);
  }, [data]);

  const chartData: ChartData[] = suggestions.map(s => ({
    name: s.componentName,
    value: s.score,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload[0]) return null;

    const suggestion = suggestions.find(s => s.componentName === label);
    if (!suggestion) return null;

    return (
      <div className={styles['memoization-tooltip']}>
        <h4>{suggestion.componentName}</h4>
        <p>{suggestion.reason}</p>
        <p>Impact: {suggestion.impact}</p>
        <p>Suggestion: {suggestion.suggestedAction}</p>
      </div>
    );
  };

  const getBarFill = (impact: 'high' | 'medium' | 'low'): string => {
    switch (impact) {
      case 'high':
        return '#ef5350';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
    }
  };

  return (
    <div className={styles['memoization-container']} data-testid="memoization-suggestions">
      <div className={styles['memoization-header']}>
        <h3>Memoization Suggestions</h3>
        <span>{suggestions.length} suggestions found</span>
      </div>

      {suggestions.length > 0 ? (
        <>
          <div className={styles['chart-container']}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="componentName"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis
                  label={{ value: 'Render Count', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="renderCount"
                  name="Render Count"
                  shape={<CustomBar />}
                  fill={(entry: MemoizationImpact) => entry.fill || '#4caf50'}
                >
                  {impactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarFill(entry.impact)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles['suggestions-list']}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`${styles['suggestion-card']} ${styles[`impact-${suggestion.impact}`]}`}
              >
                <h4>{suggestion.componentName}</h4>
                <p className={styles['suggestion-reason']}>{suggestion.reason}</p>
                <div className={styles['suggestion-details']}>
                  <div className={styles['suggestion-impact']}>
                    <label>Impact</label>
                    <span>{suggestion.impact}</span>
                  </div>
                  <div className={styles['suggestion-score']}>
                    <label>Score</label>
                    <span>{suggestion.score.toFixed(1)}%</span>
                  </div>
                </div>
                <div className={styles['suggestion-action']}>
                  <h5>Suggested Action</h5>
                  <p>{suggestion.suggestedAction}</p>
                </div>
                <div className={styles['affected-props']}>
                  <h5>Affected Props</h5>
                  <ul>
                    {suggestion.affectedProps.map((prop, i) => (
                      <li key={i}>{prop}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles['no-suggestions']}>
          <p>No memoization suggestions found. Your components appear to be well optimized!</p>
        </div>
      )}
    </div>
  );
};

export default MemoizationSuggestions; 