import merge from 'webpack-merge';
import DotEnv from 'dotenv-webpack';
import sharedConfig from './webpack.config.shared';

module.exports = merge(sharedConfig(), {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  devServer: {
    port: 8081,
    historyApiFallback: true,
  },
  plugins: [new DotEnv({ path: '../../.env' })],
});
