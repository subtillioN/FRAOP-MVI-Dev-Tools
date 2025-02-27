import { ComponentType } from 'react';
export interface PropUsage {
    componentName: string;
    propName: string;
    type: string;
    required: boolean;
    usageCount: number;
    valueChanges: number;
    lastValue: PropValue;
    valueHistory: PropValue[];
    timestamps: number[];
    relatedProps?: string[];
}
export interface PropValue {
    value: any;
    timestamp: number;
    renderCount: number;
}
export interface Pattern {
    id: string;
    description: string;
    components: string[];
    props: string[];
    confidence: number;
}
export interface FrequentUpdate {
    componentName: string;
    propName: string;
    updateCount: number;
    averageInterval: number;
}
export interface PropAnalysisResult {
    components: {
        componentName: string;
        props: PropUsage[];
    }[];
    unusedProps: PropUsage[];
    propPatterns: Pattern[];
    frequentUpdates: FrequentUpdate[];
    timestamp: number;
}
export declare class PropAnalyzer {
    private componentCache;
    private currentTime;
    trackPropUsage(component: ComponentType<any>, props: Record<string, any>, componentName: string): void;
    getAnalysis(): PropAnalysisResult;
    private detectPatterns;
    private detectFrequentUpdates;
}
