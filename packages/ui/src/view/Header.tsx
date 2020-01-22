import React, { useState } from 'react';
import {
  Toolbar,
  AppBar,
  Button,
  makeStyles,
  Link,
  IconButton,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import RouterLink from 'next/link';
import { AppConfig } from '../config';
import { useAuth } from './auth/AuthProvider';
import { getLogoutUrl, getLoginUrl } from './auth/urls';
import SideMenu from './SideMenu';

interface Props {
  className?: string;
  config: AppConfig;
  noMenu?: boolean;
}

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
  menuIcon: {
    marginRight: theme.spacing(2),
  },
}));

export default function Header({ config, className, noMenu }: Props) {
  const authState = useAuth();
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDrawerOpen = () => setMenuOpen(true);
  const handleDrawerClose = () => setMenuOpen(false);

  let rightButton = null;

  if (authState != null) {
    if (authState.userId != null) {
      rightButton = (
        <Button href={getLogoutUrl(config)} color="inherit">
          Logout
        </Button>
      );
    } else {
      rightButton = (
        <Button href={getLoginUrl(config)} color="inherit">
          Login
        </Button>
      );
    }
  }

  return (
    <AppBar position="static" className={className}>
      <Toolbar>
        {!noMenu && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={classes.menuIcon}
          >
            <MenuIcon />
          </IconButton>
        )}
        <div className={classes.title}>
          <RouterLink href="/" passHref>
            <Link color="inherit" variant="h6">
              Tsumego.app
            </Link>
          </RouterLink>
        </div>
        {rightButton}
      </Toolbar>
      <SideMenu open={menuOpen} onClose={handleDrawerClose} />
    </AppBar>
  );
}
