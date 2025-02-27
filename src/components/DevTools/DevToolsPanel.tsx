import React from 'react';
import { Drawer, Box, Typography } from '@mui/material';

interface DevToolsPanelProps {
  isOpen: boolean;
}

const DevToolsPanel: React.FC<DevToolsPanelProps> = ({ isOpen }) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      variant="persistent"
      sx={{
        '& .MuiDrawer-paper': {
          width: 320,
          bgcolor: 'background.paper',
          p: 2,
          borderLeft: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          Developer Tools
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Feature analysis and task tracking tools will be displayed here.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default DevToolsPanel; 