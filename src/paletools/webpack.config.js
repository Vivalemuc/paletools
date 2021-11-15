const path = require('path');
var WebpackObfuscator = require('webpack-obfuscator');

module.exports = [
    {
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
    },
    {
        mode: 'production',
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'paletools-prod.js'
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["raw-loader"]
                }
            ]
        }
    },
    {
        mode: 'production',
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'paletools-prod-obfuscated.js'
        },
        plugins: [
            new WebpackObfuscator({rotateStringArray: true, reservedStrings: [ '\s*' ]}, [])
        ],
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["raw-loader"]
                },
                {
                    enforce: 'post',
                    use: {
                        loader: WebpackObfuscator.loader,
                        options: {
                            reservedStrings: [ '\s*' ],
                            rotateStringArray: true
                        }
                    }
                }
            ]
        }
    }
];