import { render as rtlRender } from '@testing-library/react';
// Mock source creator for testing callbag streams
export function createMockSource(values, interval = 100) {
    return function source(type, sink) {
        if (type !== 0)
            return;
        let disposed = false;
        let index = 0;
        sink(0, (t) => {
            if (t === 2) {
                disposed = true;
            }
        });
        function push() {
            if (disposed)
                return;
            if (index >= values.length) {
                sink(2);
                return;
            }
            sink(1, values[index++]);
            if (index < values.length) {
                setTimeout(push, interval);
            }
            else {
                sink(2);
            }
        }
        push();
    };
}
export function createSink(callback) {
    return function sink(type, data) {
        if (type === 1 && data !== undefined && !(data instanceof Function)) {
            callback(data);
        }
    };
}
export function asTalkback(fn) {
    return function talkback(type) {
        fn(type);
    };
}
// Custom render function with theme and provider support
export function render(ui, { ...options } = {}) {
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
//# sourceMappingURL=test-utils.js.map