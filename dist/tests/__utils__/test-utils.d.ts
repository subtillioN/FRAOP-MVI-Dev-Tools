import React from 'react';
import { RenderOptions } from '@testing-library/react';
export declare const TestComponent: React.FC<any>;
export declare const generateMockPropData: () => {
    components: {
        componentName: string;
        props: {
            name: string;
            type: string;
            required: boolean;
            usageCount: number;
            valueChanges: number;
            lastValue: string;
        }[];
    }[];
    unusedProps: never[];
    propPatterns: never[];
    frequentUpdates: never[];
};
declare const customRender: (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
export declare const resetMocks: () => void;
export declare const createMockMonitoringService: () => {
    subscribe: (listener: Function) => () => boolean;
    emit: (event: any) => void;
};
export * from '@testing-library/react';
export { customRender as render };
