const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[chunkhash].js'
    },

    module: {
        rules: [
            {
                test: [/.js$|.ts$/],
                exclude: /(node_modules)/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            },
            {
                test: [/.css$|.scss$/],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }
        ]
    },

    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ],
        extensions: ['.js', '.ts']
    },

    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.join(__dirname, '..')
        }),
        new CopyWebpackPlugin([{
            from: './src/assets',
            to: 'assets'
        }]),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[chunkhash].css'
        }),
        new MonacoWebpackPlugin({
            languages: ['javascript']
        })
    ]
}
