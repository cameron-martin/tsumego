import webpack from 'webpack';
import merge from 'webpack-merge';
import sharedConfig from './webpack.config.shared';

module.exports = merge(
  sharedConfig({ cssFilename: '[name].[chunkhash].css' }),
  {
    mode: 'production',
    output: {
      chunkFilename: '[name].[chunkhash].js',
      filename: '[name].[chunkhash].js',
      publicPath: '/',
    },
    plugins: [
      new webpack.EnvironmentPlugin([
        'NODE_ENV',
        'UI_HOST',
        'API_HOST',
        'COGNITO_CLIENT_ID',
        'COGNITO_WEB_URI',
        'SENTRY_ENVIRONMENT',
      ]),
    ],
  },
);
