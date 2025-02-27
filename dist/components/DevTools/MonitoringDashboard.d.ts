import React from 'react';
import { PropAnalysisResult } from '../../utils/propAnalysis';
interface MonitoringDashboardProps {
    data: PropAnalysisResult;
    refreshInterval?: number;
}
declare const MonitoringDashboard: React.FC<MonitoringDashboardProps>;
export default MonitoringDashboard;
