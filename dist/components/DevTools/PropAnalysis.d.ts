import React from 'react';
import { PropAnalysisResult, Pattern } from '../../utils/propAnalysis';
interface Props {
    data: PropAnalysisResult;
    onPatternSelect?: (pattern: Pattern) => void;
}
declare const PropAnalysis: React.FC<Props>;
export default PropAnalysis;
