import merge from 'webpack-merge';
import DotEnv from 'dotenv-webpack';
import sharedConfig from './webpack.config.shared';

module.exports = merge(sharedConfig(), {
  mode: 'development',
  devServer: {
    port: 8081,
  },
  plugins: [new DotEnv({ path: '../../.env' })],
});
