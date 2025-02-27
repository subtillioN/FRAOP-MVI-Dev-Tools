import { ComponentUsage } from '../types';
export interface PropAnalysisResult {
    components: ComponentUsage[];
    frequentUpdates: Array<{
        componentName: string;
        propName: string;
        updateCount: number;
    }>;
    unusedProps: Array<{
        componentName: string;
        propName: string;
    }>;
    propPatterns: Array<{
        type: 'frequent-updates' | 'unused' | 'dependent';
        components: string[];
        props: string[];
        description: string;
    }>;
}
export declare function analyzePropUsage(components: ComponentUsage[]): PropAnalysisResult;
