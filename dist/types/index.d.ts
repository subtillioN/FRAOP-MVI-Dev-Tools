export interface DevToolsConfig {
    target: HTMLElement;
    features?: Array<'monitoring' | 'optimization' | 'analysis' | 'patterns' | 'timeline' | 'performance'>;
    theme?: 'light' | 'dark';
    plugins?: Array<{
        name: string;
        init?: () => void;
    }>;
    position?: {
        x: number;
        y: number;
    };
}
