const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  // Basic configuration
  entry: './src/unremarkable.ts',
  // Necessary in order to use source maps and debug directly TypeScript files
  devtool: 'source-map',
  module: {
      rules: [
          // Necessary in order to use TypeScript
          {
              test: /\.ts$/,
              use: 'ts-loader',
              exclude: /node_modules/,
          },
      ],
  },
  resolve: {
      // Alway keep '.js' even though you don't use it.
      // https://github.com/webpack/webpack-dev-server/issues/720#issuecomment-268470989
      extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'unremarkable.js',
    path: path.resolve(__dirname, 'dist/src'),
    // This line is VERY important for VS Code debugging to attach properly
    // Tamper with it at your own risks
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
  plugins: [
    // No need to write a index.html
    new HtmlWebpackPlugin(),
    // Do not accumulate files in ./dist
    new CleanWebpackPlugin(),
    // Copy assets to serve them
    new CopyPlugin({patterns: [{ from: path.resolve(__dirname, './images'), to: path.resolve(__dirname, './dist/src/images')}]}),
  ],
  devServer: {
    // webpack-dev-server configuration
    static: path.join(__dirname, 'dist/src'),
    // keep port in sync with VS Code launch.json
    port: 3000,
    // Hot-reloading, the sole reason to use webpack here <3
    hot: true,
    devMiddleware: {
      writeToDisk: true,
    },
},
mode: 'development'
};