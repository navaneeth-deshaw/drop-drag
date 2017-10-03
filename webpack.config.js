var webPack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var autoprefixer = require('autoprefixer');
var CleanPlugin = require('clean-webpack-plugin');
var path = require("path");
var production = process.env.NODE_ENV === 'production';


var externals = (!!production)  ? {
  //"jquery": "jQuery"
} : {};
var cdn = (!!production) ? ['//ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js'] : [];

var plugins = [
  new CleanPlugin('dist'),
  // working with chunks. Need to test!
  new webPack.optimize.CommonsChunkPlugin({
    name:      'vendor',
    children:  true,
    minChunks: 2
  }),

    new HtmlWebpackPlugin({ filename: 'drag-drop.html', template: 'drag-drop.html', chunks: ['dragdrop'], cdn: cdn}),
  new ExtractTextPlugin("[name]-[hash].css", {allChunks: true}),
  new CopyWebpackPlugin([
  ])];

if (production) {
  plugins = plugins.concat([
    // Production plugins go here
    new webPack.optimize.UglifyJsPlugin({
      mangle:   true,
      compress: {
        warnings: false, // Suppress uglification warnings
      },
    }),
  ]);
}


module.exports = {
  context: path.join(__dirname, 'src'),
  eslint: {
    configFile: '.eslintrc',
    failOnError: true
  },
  entry: {
    dragdrop: './drag-drop.js',

  },
  output: {
    path: 'dist',
    filename: '[name]-[hash].js',
  },
  externals: externals,
  plugins: plugins,
  module: {
    preLoaders: [
      {test: /\.js$/, loader: "eslint-loader", include: "src"}
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-1']
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!sass-loader")},
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")},
      { test: /\.(png|jpg|svg|eot|ttf|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=3000' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.(woff2|woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=200000' } // inline base64 URLs for <=8k images, direct URLs for the rest
    ]
  },
  htmlLoader: {
    ignoreCustomFragments: [/\{\{.*?}}/]
  },
  postcss: [ autoprefixer({ browsers: ['last 4 versions'] }) ]
};
