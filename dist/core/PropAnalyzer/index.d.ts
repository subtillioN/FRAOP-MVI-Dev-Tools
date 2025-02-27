import { ComponentType } from 'react';
export interface PropUsage {
    componentName: string;
    props: {
        name: string;
        type: string;
        required: boolean;
        usageCount: number;
        defaultValue?: any;
        valueChanges?: number;
        lastValue?: any;
    }[];
}
export interface PropAnalysisResult {
    components: PropUsage[];
    unusedProps: {
        componentName: string;
        propName: string;
    }[];
    propPatterns: {
        pattern: string;
        count: number;
        components: string[];
    }[];
    frequentUpdates: {
        componentName: string;
        propName: string;
        updateCount: number;
    }[];
}
export declare class PropAnalyzer {
    private componentCache;
    private renderCount;
    private memoizedAnalysis;
    private lastAnalysisTimestamp;
    private lastUpdateTimestamp;
    private batchedUpdates;
    private readonly CACHE_THRESHOLD;
    private readonly BATCH_THRESHOLD;
    trackPropUsage(Component: ComponentType<any>, props: Record<string, any>, componentName: string): void;
    private shouldProcessBatch;
    private processBatchedUpdates;
    private areValuesEqual;
    private cloneValue;
    private getPropType;
    private isRequired;
    private getDefaultValue;
    analyzeProps(): PropAnalysisResult;
    getComponentPropUsage(componentName: string): PropUsage | undefined;
    getRenderCount(componentName: string): number;
    reset(): void;
}
