import { useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { useRouter } from 'next/router';

export default function Tracking() {
  const userId = useAuth();
  const router = useRouter();

  useEffect(() => {
    gtag('set', { user_id: userId });
  }, [userId]);

  useEffect(() => {
    gtag('config', process.env.GA_ID, { page_path: router.pathname });
  }, [router.pathname]);

  return null;
}
