const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, '../src'),
    resolve: {
        alias: {
            '~': path.resolve(__dirname, '../src'),
        },
        extensions: ['.ts'],
    },
    entry: './index.ts',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, '../build'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, '../public'),
                to: path.resolve(__dirname, '../build'),
            }],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
