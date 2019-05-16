path = require('path')

module.exports = {
    entry: ['./src/index.js', './src/scss/application.scss'],
    output: {
        path: path.join(__dirname, 'public/asset/js'),
        publicPath: '/asset/js',
        filename: 'app.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
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