const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

let project = process.env.project;
let entry, template;

if (!project) {
  entry = path.resolve(__dirname, 'index.js');
  template = path.resolve(__dirname, 'index.html');
} else {
  entry = path.resolve(__dirname, `packages/${project}/index.js`);
  template = path.resolve(__dirname, `packages/${project}/index.html`);
}

const webpackConfig = {
  mode: 'development',
  entry,
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'index.bundle.js'
  },
  devServer: {
    proxy: {
      '/Visualization': {
        target: 'http://localhost:9000',
        pathRewrite: {'^/Visualization': '/docs'}
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
      '@': __dirname
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
