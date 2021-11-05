const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'paletools.js'
    },
    module: {
        rules: [
            { 
                test: /\.css$/i,
                use: ["raw-loader"]
            }
        ]
    }
};