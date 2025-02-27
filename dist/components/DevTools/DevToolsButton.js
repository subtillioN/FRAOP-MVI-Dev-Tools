import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
const DevToolsButton = ({ onClick, isOpen }) => {
    return (React.createElement(Tooltip, { title: "Developer Tools - Task & Feature Analysis", arrow: true, placement: "left" },
        React.createElement(IconButton, { "aria-label": "Developer Tools", color: "primary", onClick: onClick, sx: {
                position: 'fixed',
                top: '16px',
                right: '16px',
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                transform: isOpen ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)',
                },
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.2)',
            } },
            React.createElement(SettingsIcon, null))));
};
export default DevToolsButton;
//# sourceMappingURL=DevToolsButton.js.map