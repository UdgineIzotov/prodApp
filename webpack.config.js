var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/app/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      '@less-helpers-module': path.resolve(__dirname, 'src/assets/less/helpers'),  // alias for less helpers
      '@images-root-path': path.resolve(__dirname, 'src/assets/images'),           // alias for images path
    }
  },
  module: {

    loaders: [
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|png|svg|eot|ttf|woff)$/,
        use: [{
          loader: 'url-loader',
          options: {
            // limit: 10000,
            name: 'images/[name].[ext]'
          }
        }]
      },
      {
        test: /\.hbs/,
        loader: "handlebars-template-loader",
        query: {
          runtime: 'handlebars/dist/handlebars.runtime.js',
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ["es2015"]
          }
        },
          {
            loader: 'eslint-loader',
            options: {
            }
          }
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new CopyWebpackPlugin([
      'src/index.html',
      {from: 'src/static/', to: 'static/'},
      'src/assets/images'
    ]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery'",
      "window.$": "jquery"
    })
  ],
  devServer: {
    contentBase: './dist',
    port: 3000
  }
};
