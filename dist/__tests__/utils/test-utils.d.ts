import React from 'react';
import { Source } from 'callbag';
type CallbagSink<T> = (type: number, data?: T) => void;
export declare function createMockSource<T>(values: T[]): Source<T>;
export declare function createSink<T>(callback: (value: T) => void): CallbagSink<T>;
export declare function asTalkback(fn: (type: number) => void): CallbagSink<any>;
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
