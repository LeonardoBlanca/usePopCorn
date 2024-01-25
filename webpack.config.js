const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, 'src', 'main.jsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
            }
        ],
    }
}