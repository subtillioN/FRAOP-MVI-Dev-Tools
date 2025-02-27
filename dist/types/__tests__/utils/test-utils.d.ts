import React from 'react';
type CallbagType = 0 | 1 | 2;
type CallbagData<T> = T | ((type: CallbagType) => void);
type CallbagSource<T> = (type: CallbagType, sink: CallbagSink<T>) => void;
type CallbagSink<T> = (type: CallbagType, data?: CallbagData<T>) => void;
export declare function createMockSource<T>(values: T[], interval?: number): CallbagSource<T>;
export declare function createSink<T>(callback: (value: T) => void): CallbagSink<T>;
export declare function asTalkback<T>(fn: (type: CallbagType) => void): CallbagSink<T>;
export declare function render(ui: React.ReactElement, { ...options }?: {}): import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
export declare function createMockPropAnalysis(overrides?: {}): {
    components: {
        componentName: string;
        props: ({
            name: string;
            type: string;
            required: boolean;
            usageCount: number;
            valueChanges: number;
            lastValue: string;
        } | {
            name: string;
            type: string;
            required: boolean;
            usageCount: number;
            valueChanges: number;
            lastValue: number;
        })[];
    }[];
    unusedProps: never[];
    propPatterns: never[];
    frequentUpdates: {
        componentName: string;
        propName: string;
        updateCount: number;
    }[];
};
export declare function createMockPerformanceMetrics(overrides?: {}): {
    renderTime: number;
    updateCount: number;
    lastUpdate: number;
    memoryUsage: number;
    cpuUsage: number;
};
export * from '@testing-library/react';
