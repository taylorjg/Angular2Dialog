const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const packageJson = require('./package.json');

const serverPublic = path.join(__dirname, 'server', 'public');

module.exports = {
    entry: {
        'main': './client/main.ts',
        'vendor': './client/vendor.ts'
    },
    output: {
        path: serverPublic,
        filename: 'bundle.js'
    },
    plugins: [
        new CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js'}),
        new CompressionPlugin({ regExp: /\.css$|\.html$|\.js$|\.map$/ }),
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
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'tslint-loader',
                enforce: 'pre'
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: serverPublic,
        proxy: {
            "/api": "http://localhost:3000"
        }
    }
};
