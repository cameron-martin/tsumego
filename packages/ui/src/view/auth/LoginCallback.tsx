import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import { useEffect } from 'react';
import { navigate } from '@reach/router';

interface Props {
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

export default function LoginCallback({ tokenManager }: Props) {
  useEffect(() => {
    tokenManager.useAuthorizationCode(window.location.href);
    navigate('/', { replace: true });
  });

  return null;
}
