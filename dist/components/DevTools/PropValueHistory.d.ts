import React from 'react';
import { PropAnalysisResult } from '../../utils/propAnalysis';
interface PropValueHistoryProps {
    data: PropAnalysisResult;
    maxHistory?: number;
}
declare const PropValueHistory: React.FC<PropValueHistoryProps>;
export default PropValueHistory;
