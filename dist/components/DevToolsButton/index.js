import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
export function DevToolsButton({ onClick, tooltipPlacement = 'bottom', tooltipTitle = 'Developer Tools - Task & Feature Analysis' }) {
    return (React.createElement(Tooltip, { title: tooltipTitle, arrow: true, placement: tooltipPlacement },
        React.createElement(IconButton, { "aria-label": "Developer Tools", color: "primary", onClick: onClick, sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)',
                },
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.2)',
            } },
            React.createElement(SettingsIcon, null))));
}
export default DevToolsButton;
//# sourceMappingURL=index.js.map