import React from 'react';
export interface DevToolsButtonProps {
    onClick?: () => void;
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
    tooltipTitle?: string;
}
export declare function DevToolsButton({ onClick, tooltipPlacement, tooltipTitle }: DevToolsButtonProps): React.JSX.Element;
export default DevToolsButton;
