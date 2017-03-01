const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
    lib: path.join(__dirname, 'lib'),
    build: path.join(__dirname, 'dist'),
};

const commonConfig = merge([
    {
        entry: {
            demo: PATHS.lib,
        },
        output: {
            path: PATHS.build,
            library: 'Demo',
            libraryTarget: 'var'
        },
    },
    parts.generateSourceMaps({ type: 'source-map' }),
    parts.loadJavaScript({ include: PATHS.lib }),
])

const libraryConfig = merge([
    commonConfig,
    {
        output: {
            filename: '[name].js',
        },
    }
])

const libraryMinConfig = merge([
    commonConfig,
    {
        output: {
            filename: '[name].min.js',
        },
    },
    parts.minifyJavascript({ useSourceMap: true }),
])

module.exports = [
    libraryConfig,
    libraryMinConfig,
];