import { PropAnalysisResult } from '../../src/core/PropAnalyzer';

export const mockPropAnalysisResult: PropAnalysisResult = {
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
        },
        {
          name: 'callback',
          type: 'function',
          required: false,
          usageCount: 2,
          valueChanges: 0,
          lastValue: () => {}
        }
      ]
    },
    {
      componentName: 'AnotherComponent',
      props: [
        {
          name: 'data',
          type: 'object',
          required: true,
          usageCount: 10,
          valueChanges: 8,
          lastValue: { id: 1 }
        }
      ]
    }
  ],
  unusedProps: [
    {
      componentName: 'TestComponent',
      propName: 'unusedProp'
    }
  ],
  propPatterns: [
    {
      pattern: 'string:required',
      count: 2,
      components: ['TestComponent', 'AnotherComponent']
    }
  ],
  frequentUpdates: [
    {
      componentName: 'AnotherComponent',
      propName: 'data',
      updateCount: 8
    }
  ]
};

export const mockTimelineData = [
  {
    timestamp: Date.now() - 5000,
    componentName: 'TestComponent',
    propName: 'testProp',
    value: 'initial'
  },
  {
    timestamp: Date.now() - 3000,
    componentName: 'TestComponent',
    propName: 'testProp',
    value: 'updated'
  },
  {
    timestamp: Date.now() - 1000,
    componentName: 'TestComponent',
    propName: 'testProp',
    value: 'final'
  }
];

export const mockPerformanceData = {
  renderCount: 15,
  propUpdateCount: 25,
  memoryUsage: 1024 * 1024 * 50 // 50MB
}; 