const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const packageJson = require('./package.json');

module.exports = {
    entry: {
        'main': './client/main.ts',
        'vendor': './client/vendor.ts'
    },
    output: {
        path: './server/public',
        filename: 'bundle.js'
    },
    plugins: [
        new CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
        new CompressionPlugin({regExp: /\.css$|\.html$|\.js$|\.map$/}),
        new HtmlWebpackPlugin({
            template: './client/index.html',
            version: packageJson.version
        }),
        new CopyWebpackPlugin([
            { context: './client', from: '**/*.css' },
            { context: './client', from: '**/*.gif' }
        ]),
        new UglifyJsPlugin({
            compress: { screw_ie8: true, warnings: false },
            mangle: { screw_ie8: true }
        })
    ],
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'tslint'
            }],
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts'
            }]
    },
    devtool: 'source-map'
};
