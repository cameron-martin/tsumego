import React, { useEffect } from 'react';
import Router from 'next/router';
import SplashPage from '../src/view/splashPage/SplashPage';
import { useConfig } from '../src/config';
import StandardTemplate from '../src/view/StandardTemplate';
import { useAuth } from '../src/view/auth/AuthProvider';

export default function Index() {
  const config = useConfig();
  const authState = useAuth();

  useEffect(() => {
    if (authState && authState.userId) {
      Router.replace('/play');
    }
  }, [authState]);

  return (
    <StandardTemplate>
      <SplashPage config={config} />
    </StandardTemplate>
  );
}
