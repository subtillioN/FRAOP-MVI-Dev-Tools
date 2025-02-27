import React from 'react';
interface DevToolsButtonProps {
    onClick: () => void;
    isOpen: boolean;
}
declare const DevToolsButton: React.FC<DevToolsButtonProps>;
export default DevToolsButton;
