import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

interface DevToolsButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const DevToolsButton: React.FC<DevToolsButtonProps> = ({ onClick, isOpen }) => {
  return (
    <Tooltip title="Developer Tools - Task & Feature Analysis" arrow placement="left">
      <IconButton
        aria-label="Developer Tools"
        color="primary"
        onClick={onClick}
        sx={{
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
        }}
      >
        <SettingsIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DevToolsButton; 