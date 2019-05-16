const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: ['./src/app.js', './src/scss/application.scss'],
    output: {
        path: path.join(__dirname, 'public/asset/js'),
        publicPath: '/asset/js',
        filename: 'app.js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react']
                }
            }
        }, {
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            publicPath: '/asset/css',
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "public/css/application.css"
        })
    ]
};