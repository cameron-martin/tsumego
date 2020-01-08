import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://311e03485e4d4bcbb99a97fba3516d2c@sentry.io/1868285',
  environment: process.env.SENTRY_ENVIRONMENT || 'development',
});
