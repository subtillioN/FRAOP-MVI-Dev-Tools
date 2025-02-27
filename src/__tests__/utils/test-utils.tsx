import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Callbag } from 'callbag';

type CallbagType = 0 | 1 | 2;
type CallbagData<T> = T | ((type: CallbagType) => void);
type CallbagSource<T> = (type: CallbagType, sink: CallbagSink<T>) => void;
type CallbagSink<T> = (type: CallbagType, data?: CallbagData<T>) => void;

// Mock source creator for testing callbag streams
export function createMockSource<T>(values: T[], interval: number = 100): CallbagSource<T> {
  return function source(type: CallbagType, sink: CallbagSink<T>) {
    if (type !== 0) return;

    let disposed = false;
    let index = 0;

    sink(0, (t: CallbagType) => {
      if (t === 2) {
        disposed = true;
      }
    });

    function push() {
      if (disposed) return;
      if (index >= values.length) {
        sink(2);
        return;
      }

      sink(1, values[index++]);

      if (index < values.length) {
        setTimeout(push, interval);
      } else {
        sink(2);
      }
    }

    push();
  };
}

export function createSink<T>(callback: (value: T) => void): CallbagSink<T> {
  return function sink(type: CallbagType, data?: CallbagData<T>) {
    if (type === 1 && data !== undefined && !(data instanceof Function)) {
      callback(data);
    }
  };
}

export function asTalkback<T>(fn: (type: CallbagType) => void): CallbagSink<T> {
  return function talkback(type: CallbagType) {
    fn(type);
  };
}

// Custom render function with theme and provider support
export function render(ui: React.ReactElement, { ...options } = {}) {
  return rtlRender(ui, { ...options });
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