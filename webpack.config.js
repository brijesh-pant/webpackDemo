const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const webpack = require('webpack');
const merge = require('webpack-merge');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// TODO: make globbing work - const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  // TODO: globbing styling not working - style: glob.sync('./app/**/*.css'),
}

const common = merge([
  {
    entry: {
      app: PATHS.app,
      // TODO: globing styling not working - style: PATHS.style,
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack Playground',
      }),
      new FaviconsWebpackPlugin({
        logo: path.join(__dirname, 'assets', 'webpack.svg'),
      }),
    ],
  },
  parts.loadJavaScript({ include: PATHS.app}),
  parts.loadCSS({ use: ['style-loader', 'css-loader', parts.autoPrefix()]}),
  parts.loadImages({
    name: '[name].[hash:8].[ext]',
  }),
]);

const production = () => merge([
  common,
  {
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[chunkhash:8].js',
    }
  },
  // TODO: make extract text webpack plugin work
  // parts.extractCSS({ use: ['css-loader'] }),
  {
    performance: {
      hints: 'warning',
      maxEntrypointSize: 100000,
      maxAssetSize: 200000,
    },
  },
  parts.generateSourceMaps({
    type: 'source-map',
  }),
  parts.extractBundles({
    bundles: [
      {
        name: 'vendor',
        // entries: ['react'],
      }
    ],
  }),
  parts.minifyJavascript({ useSourceMap: true }),
  // parts.closureMinifyPlugin(),
  parts.setFreeVariable('process.env.NODE_ENV', 'production'),
  {
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new BundleAnalyzerPlugin(),
    ]
  }
]);

const development = () => merge([
    common,
    parts.devServer({
      host: process.env.HOST,
      port: process.env.PORT,
    }),
    parts.generateSourceMaps({
      type: 'cheap-module-eval-source-map',
    }),
    {
      plugins: [
        new webpack.NamedModulesPlugin(),
      ]
    },
  ])

module.exports = env => {
  if(env === 'production') {
    return production();
  }
  return development();
}
