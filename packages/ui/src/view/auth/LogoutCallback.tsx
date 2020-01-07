import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import React, { useEffect } from 'react';
import { navigate } from '@reach/router';
import Loading from '../Loading';

interface Props {
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

export default function LogoutCallback({ tokenManager }: Props) {
  useEffect(() => {
    tokenManager.removeTokens().then(() => {
      navigate('/', { replace: true });
    });
  }, [tokenManager]);

  return <Loading />;
}
