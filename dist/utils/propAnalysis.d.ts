import { ComponentUsage, PropUsage } from '../types';
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
export declare class PropAnalyzer {
    private components;
    trackComponent(componentName: string): void;
    trackProp(componentName: string, propName: string, value: any, type: PropUsage['type']): void;
    trackRender(componentName: string, duration: number): void;
    analyze(): PropAnalysisResult;
}
