const webpack = require('webpack');
const closureCompilerPlugin = require('webpack-closure-compiler');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.autoPrefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([require('autoprefixer')]),
  }
})

exports.devServer = ({host, port}) => ({
  devServer: {
    historyApiFallback: true,
    hotOnly: true,
    // stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})

exports.loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [{
      test: /\.js$/,
      include,
      exclude,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      }
    }]
  }
})

exports.generateSourceMaps = ({type}) => ({ devtool: type });

exports.extractBundles = ({bundles, options}) => {
  const entry = {};
  const names = [];
  // Set up entries and names.
  bundles.forEach(({ name, entries }) => {
   if (entries) {
     entry[name] = entries;
   }

   names.push(name);
  });

  return {
   // Define an entry point needed for splitting.
   entry,
   plugins: [
     // Extract bundles.
     new webpack.optimize.CommonsChunkPlugin(
       Object.assign({}, options, { names }, {
        minChunks: ({ userRequest }) => (
          userRequest &&
          userRequest.indexOf('node_modules') >= 0 &&
          userRequest.match(/\.js$/)
        ),
       })
     ),
   ],
  };
}

exports.loadCSS = ({include, exclude, use} = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use,
      }
    ]
  }
})

exports.extractCSS = ({ include, exclude, use}) => ({
  module: {
    rules: [{
      test: /\.css$/,
      include,
      exclude,
      use: ExtractTextPlugin.extract({
        use,
      }),
    }]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
  ]
})

exports.loadImages = ({include, exclude} = {}) => ({
  module: {
    rules: [
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            // NOTE: following options are for image-webpack-loader, refer npm page for more info
            query: {
              progressive: true,
              optipng: {
                optimizationLevel: 7,
              },
              gifsicle: {
                interlaced: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              mozjpeg: {
                quality: 65,
              },
              svgo: {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                  {
                    removeEmptyAttrs: false,
                  }
                ]
              }
            }
          }
        ],
        include,
        exclude,
      },
    ]
  }
})


// OPTIMIZE WEBPACK BUNDLE

exports.minifyJavascript = ({ useSourceMap }) => ({
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      // sourceMap: useSourceMap,
      beautify: false, // Don't beautify output (uglier to read)
      // Preserve comments
      comments: false,
      // Extract comments to a separate file. This works only
      // if comments is set to true above.
      extractComments: false,
      // Compression specific options
      compress: {
        warnings: false,
        drop_console: true, // Drop `console` statements
      },
      // Mangling specific options
      mangle: {
        except: ['$'], // Don't mangle $
        screw_ie8 : true, // Don't care about IE8
        keep_fnames: true, // Don't mangle function names
      },
    }),
  ],
})

// using webpack-closure-compiler
exports.closureMinifyPlugin = () => ({
  plugins: [
    new closureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'ADVANCED',
      },
    })
  ]
})

exports.setFreeVariable = () => (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ],
  }
}