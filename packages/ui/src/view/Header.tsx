import React from 'react';
import { AppConfig } from '../config';
import { useAuth } from './auth/AuthProvider';
import {
  Toolbar,
  AppBar,
  Button,
  createStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';

interface Props {
  config: AppConfig;
}

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

export default function Header({ config }: Props) {
  const isLoggedIn = useAuth();
  const classes = useStyles();

  const loginUrl = `${config.cognitoWebUri}/login?response_type=code&client_id=${config.cognitoClientId}&redirect_uri=${config.uiHost}/auth/callback/login`;
  const logoutUrl = `${config.cognitoWebUri}/logout?client_id=${config.cognitoClientId}&logout_uri=${config.uiHost}/auth/callback/logout`;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Tsumego.app
        </Typography>
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
