import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

export interface DevToolsButtonProps {
  onClick?: () => void;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  tooltipTitle?: string;
}

export function DevToolsButton({
  onClick,
  tooltipPlacement = 'bottom',
  tooltipTitle = 'Developer Tools - Task & Feature Analysis'
}: DevToolsButtonProps) {
  return (
    <Tooltip title={tooltipTitle} arrow placement={tooltipPlacement}>
      <IconButton
        aria-label="Developer Tools"
        color="primary"
        onClick={onClick}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)',
          },
          boxShadow: '0 0 8px rgba(59, 130, 246, 0.2)',
        }}
      >
        <SettingsIcon />
      </IconButton>
    </Tooltip>
  );
}

export default DevToolsButton; 