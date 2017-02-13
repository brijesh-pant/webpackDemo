const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
}

const common = {
    entry: {
      app: PATHS.app,
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
        logo: path.join(PATHS.build, 'webpack.svg'),
      }),
    ],
}

const production = () => common;

const development = () => {
  const config = {
    devServer: {
      historyApiFallback: true,
      hotOnly: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ],
  }

  return Object.assign(
    {},
    common,
    config,
    {
      plugins: common.plugins.concat(config.plugins),
    }
  );
}

module.exports = env => {
  console.log('env: ', env);
  if(env === 'production') {
    return production();
  }
  return development();
}
