const path = require('path');
const fs = require('fs');

const projects = fs.readdirSync(path.resolve(__dirname, 'packages'));

const webpackConfig = {
  mode: 'production',
  entry: projects.reduce((entries, project) => {
    entries[project] = path.resolve(__dirname, `packages/${project}/index.js`)
    return entries;
  }, {
    index: path.resolve(__dirname, 'index.js')
  }),
  output: {
    path: path.resolve(__dirname, 'docs/js'),
    filename: '[name].bundle.js'
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
  }
};

module.exports = webpackConfig;
