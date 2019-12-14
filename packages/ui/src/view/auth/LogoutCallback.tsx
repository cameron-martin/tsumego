import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import { useEffect } from 'react';
import { navigate } from '@reach/router';

interface Props {
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

export default function LogoutCallback({ tokenManager }: Props) {
  useEffect(() => {
    tokenManager.removeTokens().then(() => {
      navigate('/', { replace: true });
    });
  });

  return null;
}
