export interface PropUsage {
    name: string;
    type: string;
    valueChanges?: number;
    usageCount?: number;
}
export interface ComponentUsage {
    componentName: string;
    props: PropUsage[];
}
export interface UnusedProp {
    componentName: string;
    propName: string;
}
export interface PropPattern {
    type: 'update' | 'value';
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
