const path = require('path');

const browserConfig = {
  target: 'web',
  mode: 'production',
  entry: './src/browser.js',
  output: {
    filename: 'browser.js',
    path: path.resolve('dist'),
    library: 'nutsAuth',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  }
};

const nodeConfig = {
  target: 'node',
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve('dist'),
    libraryTarget: "commonjs",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  }
};

module.exports = [browserConfig, nodeConfig];
