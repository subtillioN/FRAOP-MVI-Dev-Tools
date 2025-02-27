import React from 'react';
import { PropAnalysisResult, Pattern } from '../../utils/propAnalysis';
import { Treemap, ResponsiveContainer } from 'recharts';

interface Props {
  data: PropAnalysisResult;
  onPatternSelect?: (pattern: Pattern) => void;
}

type ImpactLevel = 'high' | 'medium' | 'low';

interface TreemapData {
  name: string;
  size: number;
  impact: ImpactLevel;
  originalPattern?: Pattern;
  children?: TreemapData[];
}

interface TreemapShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  impact: ImpactLevel;
  onClick?: () => void;
}

const TreemapShape: React.FC<TreemapShapeProps> = ({ x, y, width, height, name, impact, onClick }) => {
  const getPatternColor = (impact: ImpactLevel): string => {
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
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: getPatternColor(impact),
          stroke: '#fff',
          strokeWidth: 2,
          cursor: 'pointer'
        }}
        onClick={onClick}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        fill="#fff"
        fontSize={12}
      >
        {name}
      </text>
    </g>
  );
};

const PropAnalysis: React.FC<Props> = ({ data, onPatternSelect }) => {
  const treemapData = React.useMemo(() => {
    const patterns = data.propPatterns.map(pattern => {
      const confidence = pattern.confidence;
      const impact: ImpactLevel = confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low';
      
      return {
        name: pattern.description,
        size: pattern.components.length * pattern.props.length,
        impact,
        originalPattern: pattern
      };
    });

    return {
      name: 'Prop Patterns',
      children: patterns
    };
  }, [data]);

  const getPatternColor = (impact: ImpactLevel): string => {
    switch (impact) {
      case 'high':
        return '#ef5350';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
    }
  };

  const handlePatternClick = (data: TreemapData) => {
    if (data.originalPattern && onPatternSelect) {
      onPatternSelect(data.originalPattern);
    }
  };

  return (
    <div>
      <h3>Prop Pattern Analysis</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <Treemap
            data={[treemapData]}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
            {treemapData.children?.map((item, index) => (
              <TreemapShape
                key={index}
                x={0}
                y={0}
                width={100}
                height={100}
                name={item.name}
                impact={item.impact}
                onClick={() => handlePatternClick(item)}
              />
            ))}
          </Treemap>
        </ResponsiveContainer>
      </div>
      <div>
        <h4>Legend</h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div>
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                backgroundColor: getPatternColor('high'),
                marginRight: 8
              }}
            />
            High Impact
          </div>
          <div>
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                backgroundColor: getPatternColor('medium'),
                marginRight: 8
              }}
            />
            Medium Impact
          </div>
          <div>
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                backgroundColor: getPatternColor('low'),
                marginRight: 8
              }}
            />
            Low Impact
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropAnalysis; 