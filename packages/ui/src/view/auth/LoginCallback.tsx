import React, { useEffect } from 'react';
import { navigate } from '@reach/router';
import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import Loading from '../Loading';

interface Props {
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

export default function LoginCallback({ tokenManager }: Props) {
  useEffect(() => {
    tokenManager.useAuthorizationCode(window.location.href);

    tokenManager.getToken().then(() => {
      navigate('/', { replace: true });
    });
  }, [tokenManager]);

  return <Loading />;
}
