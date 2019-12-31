import React, { Suspense } from 'react';
import { Router } from '@reach/router';
import { CssBaseline, makeStyles } from '@material-ui/core';
import { ApiClient } from '@tsumego/api-client';
import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import { AppConfig } from '../config';
import Header from './Header';
import RouterPage from './RouterPage';
import Loading from './Loading';

interface Props {
  apiClient: ApiClient;
  config: AppConfig;
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flex: '0 0 auto',
  },
  body: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
});

export default function App({ apiClient, config, tokenManager }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header config={config} className={classes.header} />
      <Suspense fallback={<Loading />}>
        <Router className={classes.body}>
          <RouterPage
            path="auth/callback/login"
            page={() => import('./auth/LoginCallback')}
            props={{ tokenManager }}
          />
          <RouterPage
            path="auth/callback/logout"
            page={() => import('./auth/LogoutCallback')}
            props={{ tokenManager }}
          />
          <RouterPage path="admin" page={() => import('./admin/Home')} />
          <RouterPage
            path="admin/upload"
            page={() => import('./admin/Upload')}
            props={{ apiClient }}
          />
          <RouterPage
            path="admin/ratings"
            page={() => import('./admin/Ratings')}
            props={{ apiClient }}
          />
          <RouterPage
            path="/"
            page={() => import('./Homepage')}
            props={{ apiClient }}
          />
          <RouterPage default page={() => import('./NotFound')} />
        </Router>
      </Suspense>
    </div>
  );
}
