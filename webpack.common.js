const path = require('path');
const Webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    target: 'web',

    context: __dirname,

    entry: {
        appStyle: './src/styles/main.scss',
        app: './src/app.tsx'
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: process.env.PUBLIC_PATH || '/',
        filename: 'js/[name]-[fullhash].js',
        crossOriginLoading: 'anonymous'
    },

    module: {
        rules: [
            {
                // Use babel-loader for ts, tsx, js, and jsx files
                test: /\.[tj]sx?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(s[ac]ss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                type: 'javascript/auto',
                test: /\.(geo)?json$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'files/[name]-[hash].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|png|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'files/[name]-[hash].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new Webpack.DefinePlugin({
            PUBLIC_PATH: JSON.stringify(process.env.PUBLIC_PATH || '/'),
            API_PATH: JSON.stringify(`${process.env.API_SERVER}`),
        }),
        new FaviconsWebpackPlugin({
            logo: './src/images/favicon.ico',
            prefix: 'icons/',
            emitStats: false,
            inject: true,
            favicons: {
                icons: {
                    android: false,
                    appleIcon: false,
                    appleStartup: false,
                    coast: false,
                    favicons: true,
                    firefox: false,
                    windows: false,
                    yandex: false
                }
            }
        }),
        new MiniCssExtractPlugin({ filename: 'css/[name]-[fullhash].css' }),
        new ESLintPlugin({
            emitWarning: true,
            failOnError: false
        }),
        new CleanWebpackPlugin()
    ]
};