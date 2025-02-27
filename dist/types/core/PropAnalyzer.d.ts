import { PropAnalysisResult } from '../utils/propAnalysis';
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
    getAnalysis(): PropAnalysisResult;
    private detectPatterns;
    private detectFrequentUpdates;
}
export {};
