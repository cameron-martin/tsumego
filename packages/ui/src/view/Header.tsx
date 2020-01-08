import React from 'react';
import { Toolbar, AppBar, Button, makeStyles, Link } from '@material-ui/core';
import { Link as RouterLink } from '@reach/router';
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
  const isLoggedIn = useAuth();
  const classes = useStyles();

  return (
    <AppBar position="static" className={className}>
      <Toolbar>
        <div className={classes.title}>
          <Link component={RouterLink} color="inherit" variant="h6" to="/">
            Tsumego.app
          </Link>
        </div>
        {isLoggedIn ? (
          <Button href={getLogoutUrl(config)} color="inherit">
            Logout
          </Button>
        ) : (
          <Button href={getLoginUrl(config)} color="inherit">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
