import * as DevTools from '../src';

describe('Module Structure', () => {
  describe('Core Exports', () => {
    test('should export PropAnalyzer', () => {
      expect(DevTools.PropAnalyzer).toBeDefined();
    });

    test('should export MonitoringService', () => {
      expect(DevTools.MonitoringService).toBeDefined();
    });

    test('should export initDevTools function', () => {
      expect(typeof DevTools.initDevTools).toBe('function');
    });
  });

  describe('Component Exports', () => {
    const expectedComponents = [
      'MonitoringDashboard',
      'OptimizationRecommendations',
      'RenderImpactAnalysis',
      'PropValueHistory',
      'PropPatternDetection',
      'PropTimeline',
      'RealTimeMonitoring',
      'PerformanceImpact'
    ];

    expectedComponents.forEach(componentName => {
      test(`should export ${componentName}`, () => {
        expect(DevTools[componentName]).toBeDefined();
      });
    });
  });

  describe('Type Exports', () => {
    test('should export PropAnalysisResult type', () => {
      // TypeScript type tests are compile-time checks
      // This is just to verify the type is exported
      const result: DevTools.PropAnalysisResult = {
        components: [],
        unusedProps: [],
        propPatterns: [],
        frequentUpdates: []
      };
      expect(result).toBeDefined();
    });

    test('should export PropUsage type', () => {
      const usage: DevTools.PropUsage = {
        componentName: 'test',
        props: []
      };
      expect(usage).toBeDefined();
    });

    test('should export MonitoringEvent type', () => {
      const event: DevTools.MonitoringEvent = {
        type: 'update',
        timestamp: Date.now(),
        data: {}
      };
      expect(event).toBeDefined();
    });
  });

  describe('Initialization', () => {
    let originalEnv: string | undefined;

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    test('should initialize in development mode', () => {
      const mockElement = document.createElement('div');
      const consoleSpy = jest.spyOn(console, 'log');
      
      DevTools.initDevTools({
        target: mockElement,
        theme: 'dark'
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Dev tools initialized with config:',
        expect.any(Object)
      );

      consoleSpy.mockRestore();
    });

    test('should not initialize in production mode', () => {
      process.env.NODE_ENV = 'production';
      
      const mockElement = document.createElement('div');
      const consoleSpy = jest.spyOn(console, 'log');
      
      DevTools.initDevTools({
        target: mockElement
      });

      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
}); 