const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        new HtmlWebpackPlugin({
            template: './client/index.html',
            version: packageJson.version
        }),
        new CopyWebpackPlugin([
            { context: './client', from: '**/*.css' },
            { context: './client', from: '**/*.gif' }
        ])
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
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.ts$/,
                loader: 'ts'
            }]
    }
};
