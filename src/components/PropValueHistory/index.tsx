import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../../styles/base.module.css';
import { PropAnalysisResult } from '../../core/PropAnalyzer';
import { MonitoringService, MonitoringEvent } from '../../services/MonitoringService';

interface PropValueHistoryProps {
  data: PropAnalysisResult;
}

interface ValueHistoryEntry {
  timestamp: number;
  value: any;
  renderCount: number;
}

interface PropHistory {
  componentName: string;
  propName: string;
  history: ValueHistoryEntry[];
}

const PropValueHistory: React.FC<PropValueHistoryProps> = ({ data }) => {
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [selectedProp, setSelectedProp] = useState<string>('');
  const [propHistory, setPropHistory] = useState<PropHistory[]>([]);

  useEffect(() => {
    const monitoringService = MonitoringService.getInstance();
    const unsubscribe = monitoringService.subscribe((event: MonitoringEvent) => {
      if (event.type === 'update') {
        const analysis = event.data as PropAnalysisResult;
        if (selectedComponent && selectedProp) {
          const component = analysis.components.find(c => c.componentName === selectedComponent);
          const prop = component?.props.find(p => p.name === selectedProp);
          if (prop?.lastValue !== undefined) {
            setPropHistory(prev => {
              const existingHistory = prev.find(h => 
                h.componentName === selectedComponent && h.propName === selectedProp
              );
              if (existingHistory) {
                return prev.map(h => 
                  h.componentName === selectedComponent && h.propName === selectedProp
                    ? {
                        ...h,
                        history: [...h.history, {
                          timestamp: Date.now(),
                          value: prop.lastValue,
                          renderCount: prop.usageCount || 0
                        }]
                      }
                    : h
                );
              } else {
                return [...prev, {
                  componentName: selectedComponent,
                  propName: selectedProp,
                  history: [{
                    timestamp: Date.now(),
                    value: prop.lastValue,
                    renderCount: prop.usageCount || 0
                  }]
                }];
              }
            });
          }
        }
      }
    });

    return () => unsubscribe();
  }, [selectedComponent, selectedProp]);

  const getComponentNames = (): string[] => {
    return Array.from(
      new Set(data.components.map(c => c.componentName))
    );
  };

  const getPropNames = (componentName: string): string[] => {
    const component = data.components.find(c => c.componentName === componentName);
    return component?.props.map(p => p.name) || [];
  };

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className={styles.container}>
      <h2>Prop Value History</h2>

      <div className={styles.section}>
        <div>
          <label>
            Component:
            <select 
              value={selectedComponent} 
              onChange={e => setSelectedComponent(e.target.value)}
            >
              <option value="">Select a component</option>
              {getComponentNames().map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>

        {selectedComponent && (
          <div>
            <label>
              Prop:
              <select 
                value={selectedProp} 
                onChange={e => setSelectedProp(e.target.value)}
              >
                <option value="">Select a prop</option>
                {getPropNames(selectedComponent).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {selectedComponent && selectedProp && (
        <div className={styles.section}>
          <h3>Value History</h3>
          <div className={styles['chart-container']}>
            <LineChart width={800} height={400} data={propHistory
              .find(h => h.componentName === selectedComponent && h.propName === selectedProp)
              ?.history || []
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={value => new Date(value).toLocaleTimeString()} 
              />
              <YAxis />
              <Tooltip 
                labelFormatter={value => new Date(value).toLocaleTimeString()}
                formatter={(value: any) => [formatValue(value), 'Value']}
              />
              <Line 
                type="monotone" 
                dataKey="renderCount" 
                stroke="#8884d8" 
                name="Render Count" 
              />
            </LineChart>
          </div>

          <div className={styles['data-grid']}>
            {propHistory
              .find(h => h.componentName === selectedComponent && h.propName === selectedProp)
              ?.history.slice(-5).map((entry, index) => (
                <div key={index} className={styles['data-item']}>
                  <div className={styles['data-label']}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                  <div className={styles['data-value']}>
                    {formatValue(entry.value)}
                  </div>
                  <div>Render Count: {entry.renderCount}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropValueHistory; 