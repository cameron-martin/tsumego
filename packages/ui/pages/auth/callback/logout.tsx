import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import React, { useEffect } from 'react';
import Router from 'next/router';
import StandardTemplate from '../../../src/view/StandardTemplate';
import Loading from '../../../src/view/Loading';

interface Props {
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager | null;
}

export default function LogoutCallback({ tokenManager }: Props) {
  useEffect(() => {
    if (tokenManager != null) {
      void tokenManager.removeTokens().then(() => Router.replace('/'));
    }
  }, [tokenManager]);

  return (
    <StandardTemplate>
      <Loading />
    </StandardTemplate>
  );
}
