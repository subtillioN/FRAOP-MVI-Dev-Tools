import { Source, Callbag } from 'callbag';
import { createMockSource } from '../utils/test-utils';
import {
  calculateThroughput,
  generatePerformanceReport,
  analyzeLatencyPatterns,
  visualizeDistribution,
  visualizeTimeSeries
} from './metric-helpers';

/**
 * Helper types and functions for testing callbag sources
 * 
 * Note on type casting:
 * We use type casting in the createSink helper to bridge the gap between the callbag
 * specification and TypeScript's type system. The callbag spec expects a sink function
 * that can handle different message types (START, DATA, END) with different payload types,
 * which is difficult to express precisely in TypeScript without complex conditional types.
 */

// Message types in the callbag protocol
type MessageType = 0 | 1 | 2; // START | DATA | END
type Talkback = Callbag<never, never>;

/**
 * Safely casts an unknown value to a Talkback function
 * This is safe because we only use it when we know we're receiving a START message
 */
function asTalkback(d: unknown): Talkback {
  return d as Talkback;
}

/**
 * Creates a sink function with a more ergonomic API for testing
 * Instead of dealing with message types directly, you can provide handlers
 * for specific events (start, data, end)
 */
function createSink<T>(handlers: {
  onStart?: (talkback: Talkback) => void;
  onData?: (data: T) => void;
  onEnd?: (error?: any) => void;
}): Callbag<T, never> {
  return (type: number, data?: any) => {
    if (type === 0 && handlers.onStart) handlers.onStart(data as Talkback);
    if (type === 1 && handlers.onData) handlers.onData(data as T);
    if (type === 2 && handlers.onEnd) handlers.onEnd(data);
  };
}

type NextFn<T> = (data: T) => void;
type CompleteFn = () => void;
type ErrorFn = (error: any) => void;

describe('Stream Core', () => {
  describe('Performance Analysis', () => {
    it('should calculate throughput correctly', () => {
      const timestamps = [0, 100, 200, 300, 400, 500];
      const throughput = calculateThroughput(timestamps, 200);
      expect(throughput).toEqual([2, 2, 2]);
    });

    it('should generate performance report', () => {
      const metrics = {
        latencies: [10, 15, 20],
        throughput: [2, 2, 2],
        errors: 0,
        totalRequests: 100,
        timestamps: [0, 100, 200]
      };
      const report = generatePerformanceReport(metrics);
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('recommendations');
    });

    it('should analyze latency patterns', () => {
      const latencies = [10, 15, 20, 10, 15, 20];
      const patterns = analyzeLatencyPatterns(latencies);
      expect(patterns).toHaveProperty('trend');
      expect(patterns).toHaveProperty('anomalies');
    });

    it('should visualize distribution', () => {
      const values = [1, 2, 2, 3, 3, 3, 4, 4, 5];
      const visualization = visualizeDistribution(values);
      expect(typeof visualization).toBe('string');
      expect(visualization.length).toBeGreaterThan(0);
    });

    it('should visualize time series', () => {
      const timestamps = [0, 100, 200];
      const values = [1, 2, 3];
      const visualization = visualizeTimeSeries(timestamps, values);
      expect(typeof visualization).toBe('string');
      expect(visualization.length).toBeGreaterThan(0);
    });
  });

  describe('Stream Operations', () => {
    it('should handle backpressure', (done) => {
      let received = 0;
      const source = createMockSource([1, 2, 3, 4, 5]);
      const sink = createSink({
        onData: (data) => {
          received++;
          expect(data).toBeLessThanOrEqual(5);
        },
        onEnd: () => {
          expect(received).toBe(5);
          done();
        },
      });

      source(0, sink);
    });

    it('should handle errors gracefully', (done) => {
      const error = new Error('Test error');
      const source = createMockSource([1, 2, error, 4, 5]);
      const sink = createSink({
        onData: (data) => {
          expect(typeof data).toBe('number');
        },
        onEnd: (err) => {
          expect(err).toBe(error);
          done();
        },
      });

      source(0, sink);
    });
  });
}); 