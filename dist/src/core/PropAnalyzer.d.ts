export interface PropUsage {
    name: string;
    type: string;
    required: boolean;
    usageCount: number;
    defaultValue?: any;
    valueChanges?: number;
    lastValue?: any;
}
export interface ComponentUsage {
    componentName: string;
    props: PropUsage[];
}
export interface UnusedProp {
    componentName: string;
    propName: string;
    updateCount: number;
}
export type PropPatternType = 'update' | 'value';
export interface PropPattern {
    type: PropPatternType;
    frequency: number;
}
export interface FrequentUpdate {
    componentName: string;
    propName: string;
}
export interface PropAnalysisResult {
    components: ComponentUsage[];
    unusedProps: UnusedProp[];
    propPatterns: PropPattern[];
    frequentUpdates: FrequentUpdate[];
}
export declare class PropAnalyzer {
    private static instance;
    private constructor();
    static getInstance(): PropAnalyzer;
    analyze(): PropAnalysisResult;
}
