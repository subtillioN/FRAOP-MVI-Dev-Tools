import React from 'react';
import { PropAnalysisResult } from '../../utils/analysis/types';
import { MonitoringService } from '../../services/monitoring/MonitoringService';
interface Props {
    data: PropAnalysisResult;
    monitoringService: MonitoringService;
}
declare const RealTimeMonitoring: React.FC<Props>;
export default RealTimeMonitoring;
