/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path') ;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: "./src/server.ts",
    target: 'node',
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, ],
    },
    mode: "production",
    optimization:{
        minimize: false
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [
            new TsConfigPathsPlugin({
                configFile: './tsconfig.json',
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'server.js',
    },
};