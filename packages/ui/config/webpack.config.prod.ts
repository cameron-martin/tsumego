import merge from 'webpack-merge';
import sharedConfig from './webpack.config.shared';

module.exports = merge(
  sharedConfig({ cssFilename: '[name].[chunkhash].css' }),
  {
    mode: 'production',
    output: {
      chunkFilename: '[name].[chunkhash].js',
      filename: '[name].[chunkhash].js',
    },
  },
);
