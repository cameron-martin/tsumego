import { OAuth2AuthorisationCodeFlowTokenManager } from '../../api-client/authentication/OAuth2AuthorisationCodeFlowTokenManager';
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
