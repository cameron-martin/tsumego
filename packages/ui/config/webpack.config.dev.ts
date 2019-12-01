import merge from 'webpack-merge';
import sharedConfig from './webpack.config.shared';

module.exports = merge(sharedConfig(), {
  mode: 'development',
  devServer: {
    port: 8081,
  },
});
