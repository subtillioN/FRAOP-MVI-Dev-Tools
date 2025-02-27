import React from 'react';
import { PropAnalysisResult } from '../../core/PropAnalyzer';
interface RealTimeMonitoringProps {
    data: PropAnalysisResult;
}
declare global {
    interface Performance {
        memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
        };
    }
}
declare const RealTimeMonitoring: React.FC<RealTimeMonitoringProps>;
export default RealTimeMonitoring;
