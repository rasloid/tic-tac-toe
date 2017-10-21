const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        'babel-polyfill',
        './src/client/index'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /(\.css|\.less)$/,
                use: ['style-loader','css-loader', 'postcss-loader','less-loader'],

            },
            {
                test: /\.js$/,
                use: 'eslint-loader',
                enforce: 'pre',
                include: [
                    path.resolve(__dirname, "src"),
                ],
            },

            {
                test: /\.js$/,
                loader: 'react-hot-loader',
                include: [
                    path.resolve(__dirname, 'src')
                ],
                options: {
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'src')
                ],
                options: {
                    plugins: ['transform-runtime']
                }

            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader'
            }
        ]
    }
};





















