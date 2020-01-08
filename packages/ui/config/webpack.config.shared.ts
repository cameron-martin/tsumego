import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { StylableWebpackPlugin } from '@stylable/webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

interface Settings {
  cssFilename?: string;
}

const sharedConfig = (settings?: Settings): webpack.Configuration => ({
  entry: {
    sentry: './src/sentry.ts',
    main: './src/index.tsx',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
    }),
    new StylableWebpackPlugin({
      filename: settings && settings.cssFilename,
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
});

export default sharedConfig;
