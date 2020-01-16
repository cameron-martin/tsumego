/* eslint-disable @typescript-eslint/no-var-requires */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const path = require('path');

module.exports = phase => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  if (isDev) {
    require('dotenv').config({
      path: path.join(__dirname, '..', '..', '.env'),
    });
  }

  return {
    env: {
      UI_HOST: process.env.UI_HOST,
      API_HOST: process.env.API_HOST,
      COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
      COGNITO_WEB_URI: process.env.COGNITO_WEB_URI,
      SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
      GA_ID: 'UA-154885599-1',
    },
    reactStrictMode: true,
    target: 'serverless',
    /**
     *
     * @param {import('webpack').Configuration} config
     */
    webpack(config, { isServer }) {
      config.module.rules.push({
        test: /\.jpg/,
        use: {
          loader: 'responsive-loader',
          options: {
            adapter: require('responsive-loader/sharp'),
            sizes: [500, 1000, 2000, 4000],
            publicPath: `/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
          },
        },
      });

      return config;
    },
  };
};
