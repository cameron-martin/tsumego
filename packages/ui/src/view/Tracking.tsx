/* eslint-disable @typescript-eslint/camelcase */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';

export default function Tracking() {
  const userId = useAuth();
  const location = useLocation();

  useEffect(() => {
    gtag('set', { user_id: userId });
  }, [userId]);

  useEffect(() => {
    gtag('config', 'UA-154885599-1', { page_path: location.pathname });
  }, [location.pathname]);

  return null;
}
