import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline, makeStyles } from '@material-ui/core';
import { ApiClient } from '@tsumego/api-client';
import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import { AppConfig } from '../config';
import Header from './Header';
import RouterPage from './RouterPage';
import Loading from './Loading';
import Tracking from './Tracking';

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
});

export default function App({ apiClient, config, tokenManager }: Props) {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Tracking />
        <Header config={config} className={classes.header} />
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route path="/auth/callback/login">
              <RouterPage
                page={() => import('./auth/LoginCallback')}
                props={{ tokenManager }}
              />
            </Route>
            <Route path="/auth/callback/logout">
              <RouterPage
                page={() => import('./auth/LogoutCallback')}
                props={{ tokenManager }}
              />
            </Route>
            <Route path="/admin" exact>
              <RouterPage page={() => import('./admin/Home')} />
            </Route>
            <Route path="/admin/upload">
              <RouterPage
                page={() => import('./admin/Upload')}
                props={{ apiClient }}
              />
            </Route>
            <Route path="/admin/ratings">
              <RouterPage
                page={() => import('./admin/Ratings')}
                props={{ apiClient }}
              />
            </Route>
            <Route path="/" exact>
              <RouterPage
                page={() => import('./Homepage')}
                props={{ apiClient, config }}
              />
            </Route>
            <Route path="*">
              <RouterPage page={() => import('./NotFound')} />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}
