import React from 'react';
import { Drawer, Box, Typography } from '@mui/material';
const DevToolsPanel = ({ isOpen }) => {
    return (React.createElement(Drawer, { anchor: "right", open: isOpen, variant: "persistent", sx: {
            '& .MuiDrawer-paper': {
                width: 320,
                bgcolor: 'background.paper',
                p: 2,
                borderLeft: '1px solid',
                borderColor: 'divider',
            },
        } },
        React.createElement(Box, null,
            React.createElement(Typography, { variant: "h6", gutterBottom: true }, "Developer Tools"),
            React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "Feature analysis and task tracking tools will be displayed here."))));
};
export default DevToolsPanel;
//# sourceMappingURL=DevToolsPanel.js.map