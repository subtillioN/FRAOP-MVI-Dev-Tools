import React, { useState, useEffect } from 'react';
import { MonitoringDashboard, MonitoringService, PropAnalyzer } from 'fraop-mvi-dev-tools';

// Example component to monitor
const Counter: React.FC<{ initialValue: number }> = ({ initialValue }) => {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};

// HOC to track props
const withPropTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return function TrackedComponent(props: P) {
    const analyzer = PropAnalyzer.getInstance();

    useEffect(() => {
      analyzer.trackPropUsage(WrappedComponent, props, componentName);
    }, [props]);

    return <WrappedComponent {...props} />;
  };
};

// Tracked version of Counter
const TrackedCounter = withPropTracking(Counter, 'Counter');

// Development tools component
const DevTools: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const service = MonitoringService.getInstance();
    
    // Start monitoring
    service.startMonitoring(1000); // Update every second

    // Subscribe to updates
    const unsubscribe = service.subscribe(event => {
      if (event.type === 'update') {
        setData(event.data);
      }
    });

    return () => {
      service.stopMonitoring();
      unsubscribe();
    };
  }, []);

  if (!data) return null;

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: 400, height: '100vh', backgroundColor: '#fff', boxShadow: '-2px 0 5px rgba(0,0,0,0.1)', padding: 20, overflow: 'auto' }}>
      <MonitoringDashboard data={data} />
    </div>
  );
};

// Main App
export const App: React.FC = () => {
  return (
    <div>
      <h1>Counter Example</h1>
      <TrackedCounter initialValue={0} />
      {process.env.NODE_ENV === 'development' && <DevTools />}
    </div>
  );
}; 