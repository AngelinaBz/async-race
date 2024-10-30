const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');
module.exports = {
  entry: path.resolve(__dirname, './src/index'),

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts$/i,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new EslingPlugin({
      extensions: 'ts',
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
  },

  mode: 'development',
};
