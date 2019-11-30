import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { StylableWebpackPlugin } from '@stylable/webpack-plugin';

const config: webpack.Configuration = {
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /.tsx?/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/view/index.ejs',
      title: 'Play Go',
    }),
    new StylableWebpackPlugin(),
  ],
};

module.exports = config;
