const path = require('path');  
const HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {  
  entry: path.join(__dirname, 'src', 'index.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'GL-REACT SAMPLE'
    })
  ]
};