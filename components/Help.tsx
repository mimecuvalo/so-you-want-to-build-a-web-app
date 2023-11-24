import { IconButton, Menu, MenuItem, Drawer, Typography } from '@mui/material';
import { F, defineMessages, useIntl } from 'i18n';
import { MouseEvent, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';

import { Help as HelpIcon } from '@mui/icons-material';
import Link from './Link';

const HelpContainer = styled('div')`
  display: inline-block;
`;

const messages = defineMessages({
  help: { defaultMessage: 'Help' },
});

export default function Help() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const [isExperimentsOpen, setIsExperimentsOpen] = useState(false);
  const intl = useIntl();
  const theme = useTheme();

  const handleMenuOpenerClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdmin = () => {
    handleClose();
    window.location.href = '/admin';
  };

  const handleExperiments = () => {
    handleClose();
    setIsExperimentsOpen(true);
  };

  const handleStyleguide = () => {
    handleClose();
    window.open('http://localhost:9001', 'styleguide');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderStyleguide = () => {
    // Conditionally compile this code. Should not appear in production.
    if (process.env.NODE_ENV === 'development') {
      return (
        <MenuItem key="styleguide" onClick={handleStyleguide}>
          Styleguide
        </MenuItem>
      );
    }

    return null;
  };

  const isOpen = Boolean(anchorEl);
  const helpAriaLabel = intl.formatMessage(messages.help);

  return (
    <HelpContainer>
      <IconButton
        aria-label={helpAriaLabel}
        aria-owns={isOpen ? 'help-menu' : undefined}
        aria-haspopup="true"
        onClick={handleMenuOpenerClick}
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
          <F defaultMessage="Admin" />
        </MenuItem>
        <MenuItem key="experiments" onClick={handleExperiments}>
          <F defaultMessage="Experiments" />
        </MenuItem>
        {renderStyleguide()}
        <MenuItem key="language">
          <Link href="/fr" locale="fr" sx={{ textDecoration: 'none !important', color: '#000' }}>
            <F defaultMessage="Test language alternative" />
          </Link>
        </MenuItem>
      </Menu>

      <Drawer
        anchor="right"
        open={isExperimentsOpen}
        onClose={() => setIsExperimentsOpen(false)}
        onOpen={() => setIsExperimentsOpen(true)}
      >
        <Typography variant="h1" style={{ padding: `0 ${theme.spacing(1)}` }}>
          Experiments
        </Typography>
      </Drawer>
    </HelpContainer>
  );
}
