import React, { useEffect } from 'react';
import Router from 'next/router';
import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import Loading from '../../../src/view/Loading';
import StandardTemplate from '../../../src/view/StandardTemplate';

interface Props {
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager | null;
}

export default function LoginCallback({ tokenManager }: Props) {
  useEffect(() => {
    if (tokenManager != null) {
      tokenManager.useAuthorizationCode(window.location.href);

      tokenManager.getToken().then(() => {
        Router.replace('/play');
      });
    }
  }, [tokenManager]);

  return (
    <StandardTemplate>
      <Loading />
    </StandardTemplate>
  );
}
