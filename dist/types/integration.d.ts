import { PropAnalysisResult } from '../utils/propAnalysis';
interface DevToolsHook {
    emit: (event: string, data: any) => void;
    on: (event: string, callback: (data: any) => void) => void;
    supportsFiber: boolean;
}
declare global {
    interface Window {
        __REACT_DEVTOOLS_GLOBAL_HOOK__?: DevToolsHook;
    }
}
export declare class DevToolsIntegration {
    private static instance;
    private isInitialized;
    private analysisUpdateInterval;
    private constructor();
    static getInstance(): DevToolsIntegration;
    initialize(): void;
    private registerDevToolsPanel;
    private handleComponentMount;
    private handleComponentUnmount;
    updateAnalysis(analysis: PropAnalysisResult): void;
    private startAnalysisUpdates;
    addInspectedComponent(componentId: string): void;
    removeInspectedComponent(componentId: string): void;
    getInspectedComponents(): string[];
    cleanup(): void;
}
export declare const initializeDevToolsIntegration: () => DevToolsIntegration;
export {};
