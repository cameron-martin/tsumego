import React from 'react';
import { Toolbar, AppBar, Button, makeStyles, Link } from '@material-ui/core';
import { Link as RouterLink } from '@reach/router';
import { AppConfig } from '../config';
import { useAuth } from './auth/AuthProvider';

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

  const loginUrl = `${config.cognitoWebUri}/login?response_type=code&client_id=${config.cognitoClientId}&redirect_uri=${config.uiHost}/auth/callback/login`;
  const logoutUrl = `${config.cognitoWebUri}/logout?client_id=${config.cognitoClientId}&logout_uri=${config.uiHost}/auth/callback/logout`;

  return (
    <AppBar position="static" className={className}>
      <Toolbar>
        <div className={classes.title}>
          <Link component={RouterLink} color="inherit" variant="h6" to="/">
            Tsumego.app
          </Link>
        </div>
        {isLoggedIn ? (
          <Button href={logoutUrl} color="inherit">
            Logout
          </Button>
        ) : (
          <Button href={loginUrl} color="inherit">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
