import React from 'react';
import { PropAnalysisResult } from '../../utils/propAnalysis';
import { MonitoringService } from '../../services/MonitoringService';
interface Props {
    monitoringService: MonitoringService;
    data?: PropAnalysisResult;
}
declare const RealTimeMonitoring: React.FC<Props>;
export default RealTimeMonitoring;
