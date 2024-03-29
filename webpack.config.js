const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: ["babel-polyfill", './src/app.js'], // babel-polyfill is required for use of await async and full es6 features https://babeljs.io/docs/usage/polyfill/
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css', '.json']
  },

  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            "@babel/env",
            "@babel/react"
          ],
          plugins: [
            "@babel/plugin-proposal-function-bind",
            "@babel/plugin-proposal-class-properties"
          ]
        }
      },
      {
        test: /.css?$/,
        use: [
            { loader: "style-loader" },
            { loader: "css-loader" }
        ]
      },
    ]
  }
};
