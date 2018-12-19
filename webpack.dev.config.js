const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

let workspace = process.env.workspace;
let entry, template;

if (!workspace) {
  entry = path.resolve(__dirname, 'assets/js/index.js');
  template = path.resolve(__dirname, './assets/index.html');
} else {
  entry = path.resolve(__dirname, `packages/${workspace}/index.js`);
  template = path.resolve(__dirname, `packages/${workspace}/index.html`);
}

const webpackConfig = {
  entry,
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'index.bundle.js'
  },
  devServer: {
    proxy: {
      '/Visualization': {
        target: 'http://localhost:9000',
        pathRewrite: {'^/Visualization': ''}
      }
    },
    contentBase: __dirname,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '/Visualization': __dirname
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template
    }),
    new DefinePlugin({
      ASSET_PATH: '/'
    })
  ]
};

module.exports = webpackConfig;
