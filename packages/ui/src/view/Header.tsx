import React from 'react';
import { Toolbar, AppBar, Button, makeStyles, Link } from '@material-ui/core';
import RouterLink from 'next/link';
import { AppConfig } from '../config';
import { useAuth } from './auth/AuthProvider';
import { getLogoutUrl, getLoginUrl } from './auth/urls';

interface Props {
  className?: string;
  config: AppConfig;
}

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

export default function Header({ config, className }: Props) {
  const authState = useAuth();
  const classes = useStyles();

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
        <div className={classes.title}>
          <RouterLink href="/" passHref>
            <Link color="inherit" variant="h6">
              Tsumego.app
            </Link>
          </RouterLink>
        </div>
        {rightButton}
      </Toolbar>
    </AppBar>
  );
}
