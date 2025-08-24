import { IconButton, Menu, MenuItem } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Help as HelpIcon } from '@mui/icons-material';

const HelpContainer = styled('div')`
  display: inline-block;
`;

export default function Help() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();

  const handleMenuOpenerClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdmin = () => {
    handleClose();
    window.location.href = '/admin';
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReactScan = () => {
    if (document.getElementById('react-scan')) {
      document.getElementById('react-scan')?.remove();
      return;
    }

    const script = document.createElement('script');
    script.id = 'react-scan';
    script.crossOrigin = 'anonymous';
    script.src = 'https://unpkg.com/react-scan/dist/auto.global.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  };

  const isOpen = Boolean(anchorEl);

  return (
    <HelpContainer>
      <IconButton
        aria-label="Help"
        aria-owns={isOpen ? 'help-menu' : undefined}
        aria-haspopup="true"
        onClick={handleMenuOpenerClick}
        sx={{
          color: 'var(--foreground)',
        }}
      >
        <HelpIcon />
      </IconButton>
      <Menu
        id="help-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem key="admin" onClick={handleAdmin}>
          Admin
        </MenuItem>
        <MenuItem key="react-scan" onClick={handleReactScan}>
          React Scan
        </MenuItem>
      </Menu>
    </HelpContainer>
  );
}
