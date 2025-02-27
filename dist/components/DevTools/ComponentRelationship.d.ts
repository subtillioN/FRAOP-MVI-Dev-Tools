import React from 'react';
import { PropAnalysisResult } from '../../utils/propAnalysis';
interface ComponentRelationshipProps {
    data: PropAnalysisResult;
    width?: number;
    height?: number;
}
declare const ComponentRelationship: React.FC<ComponentRelationshipProps>;
export default ComponentRelationship;
