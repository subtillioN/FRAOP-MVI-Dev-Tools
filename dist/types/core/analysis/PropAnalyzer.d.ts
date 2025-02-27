import { PropAnalysisResult, PropUsage } from '../../utils/analysis/types';
interface ComponentWithPropTypes {
    propTypes?: {
        [key: string]: {
            isRequired?: boolean;
        };
    };
}
export declare class PropAnalyzer {
    private componentCache;
    private currentTime;
    trackPropUsage(component: ComponentWithPropTypes, props: Record<string, any>, componentName: string): void;
    analyzeProps(): PropAnalysisResult;
    private detectPatterns;
    private detectFrequentUpdates;
    getComponentPropUsage(componentName: string): {
        componentName: string;
        props: PropUsage[];
    } | undefined;
    getRenderCount(componentName: string): number;
    reset(): void;
}
export {};
