var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');
var loadCSS = new ExtractTextPlugin('build/app.css')
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ModernizrWebpackPlugin = require('modernizr-webpack-plugin')
const BUILD = path.resolve(__dirname, './build');

module.exports = {
  entry: {
    build: './example',
  },
  output: {
    path: BUILD,
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: loadCSS.extract('style', 'css')
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.gif$|\.jpe?g$|\.woff|\.eot|\.ttf|\.png$|\.svg$/i,
        loader: 'url?limit=10000&name=[name].[ext]',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'HTML Hyperdrive',
      template: path.resolve(__dirname, './example/index.ejs'),
      hash: true,
      config: {
        enableStats: true,
        enableDatGui: true,
        modernizr: {
          featureDetects: [
            "touchevents"
          ]
        }
      }
    }),
    new FaviconsWebpackPlugin(path.resolve(__dirname, './example/favicon.png')),
    loadCSS,
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, './vendors') }
    ]),
    new ModernizrWebpackPlugin({
      filename: 'modernizr.bundle.js',
      'feature-detects': [
        "touchevents"
      ],
      minify: true,
    })
  ],
  devtool: "#inline-source-map",
  devServer: {
    contentBase: BUILD,
    host: "0.0.0.0"
  }
};
