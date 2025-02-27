import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { PropAnalyzer } from '../../src/core/PropAnalyzer';
import { MonitoringService } from '../../src/services/MonitoringService';

// Mock component for testing
export const TestComponent: React.FC<any> = () => <div>Test Component</div>;

// Mock data generator
export const generateMockPropData = () => ({
  components: [
    {
      componentName: 'TestComponent',
      props: [
        {
          name: 'testProp',
          type: 'string',
          required: true,
          usageCount: 5,
          valueChanges: 3,
          lastValue: 'test'
        }
      ]
    }
  ],
  unusedProps: [],
  propPatterns: [],
  frequentUpdates: []
});

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

// Reset all mocks between tests
export const resetMocks = () => {
  PropAnalyzer.prototype.reset?.();
  MonitoringService.getInstance().stopMonitoring();
};

// Create a mock monitoring service
export const createMockMonitoringService = () => {
  const listeners = new Set<Function>();
  return {
    subscribe: (listener: Function) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    emit: (event: any) => {
      listeners.forEach(listener => listener(event));
    }
  };
};

export * from '@testing-library/react';
export { customRender as render }; 