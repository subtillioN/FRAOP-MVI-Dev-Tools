import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Source } from 'callbag';

// Mock source creator for testing callbag streams
export function createMockSource<T>(values: T[]): Source<T> {
  return (...args: [number, any]) => {
    const [type, sink] = args;
    if (type !== 0) return;
    
    sink(0, (t: number) => {
      if (t === 2) {
        values.forEach(value => sink(1, value));
        sink(2);
      }
    });
  };
}

// Custom render function with theme and provider support
export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
}

// Create mock prop analysis data
export function createMockPropAnalysis(overrides = {}) {
  return {
    components: [{
      componentName: 'TestComponent',
      props: [
        {
          name: 'prop1',
          type: 'string',
          required: true,
          usageCount: 10,
          valueChanges: 25,
          lastValue: 'test',
        },
        {
          name: 'prop2',
          type: 'number',
          required: false,
          usageCount: 5,
          valueChanges: 15,
          lastValue: 42,
        },
      ],
    }],
    unusedProps: [],
    propPatterns: [],
    frequentUpdates: [{
      componentName: 'TestComponent',
      propName: 'prop1',
      updateCount: 25,
    }],
    ...overrides,
  };
}

// Create mock performance metrics
export function createMockPerformanceMetrics(overrides = {}) {
  return {
    renderTime: 10,
    updateCount: 5,
    lastUpdate: Date.now(),
    memoryUsage: 1024,
    cpuUsage: 0.5,
    ...overrides,
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react'; 