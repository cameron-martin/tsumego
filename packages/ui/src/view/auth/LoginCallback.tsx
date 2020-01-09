import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import Loading from '../Loading';

interface Props {
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

export default function LoginCallback({ tokenManager }: Props) {
  const history = useHistory();

  useEffect(() => {
    tokenManager.useAuthorizationCode(window.location.href);

    tokenManager.getToken().then(() => {
      history.replace('/');
    });
  }, [tokenManager, history]);

  return <Loading />;
}
