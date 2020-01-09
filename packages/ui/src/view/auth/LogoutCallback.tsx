import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../Loading';

interface Props {
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

export default function LogoutCallback({ tokenManager }: Props) {
  const history = useHistory();

  useEffect(() => {
    tokenManager.removeTokens().then(() => {
      history.replace('/');
    });
  }, [tokenManager, history]);

  return <Loading />;
}
