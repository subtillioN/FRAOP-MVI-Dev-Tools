import { ComponentType } from 'react';
import { Validator } from 'prop-types';
export interface PropUsage {
    name: string;
    type: string;
    required: boolean;
    usageCount: number;
    valueChanges: number;
    lastValue: any;
}
export interface ComponentUsage {
    componentName: string;
    renderCount: number;
    props: PropUsage[];
}
export interface Pattern {
    id: string;
    type: 'dependent' | 'independent' | 'correlated';
    description: string;
    components: string[];
    props: string[];
    confidence: number;
}
export interface PropAnalysisResult {
    components: ComponentUsage[];
    propPatterns: Pattern[];
    unusedProps: PropUsage[];
    timestamp: number;
}
interface PropTypeMap {
    [key: string]: Validator<any>;
}
type ComponentWithPropTypes = ComponentType<any> & {
    propTypes?: PropTypeMap;
};
export declare class PropAnalyzer {
    private componentUsage;
    private renderCounts;
    constructor();
    trackPropUsage(component: ComponentWithPropTypes, props: any, componentName: string): void;
    getComponentPropUsage(componentName: string): ComponentUsage | undefined;
    getRenderCount(componentName: string): number;
    analyzeProps(): PropAnalysisResult;
    reset(): void;
}
export {};
