const path = require("path");
var WebpackObfuscator = require("webpack-obfuscator");


module.exports = (env) => {
    process.env = {
        ...(process.env || {}),
        COMPARE_MIN_MAX_PRICES: true,
        GRID_MODE: true,
        MARKET_SEARCH_FILTERS: true,
        PLAYER_ACTIONS: true,
        SETTINGS_MENU: true,
        SNIPE: true,
        TRANSFER_TARGETS_LIMBO: true,
        UNASSIGNED_LIMBO: true,
        ...env
    };

    return [
        {
            mode: "development",
            entry: "./src/index.js",
            output: {
                path: path.resolve(__dirname, "dist"),
                filename: "paletools-lite.js"
            },
            module: {
                rules: [
                    {
                        test: /\.css$/i,
                        use: ["raw-loader"]
                    },
                    {
                        test: /\.js$/i,
                        exclude: [/node_modules/],
                        use: [path.resolve("webpack/loaders/conditional.js")]
                    }
                ]
            }
        },
        {
            mode: "production",
            entry: "./src/index.js",
            output: {
                path: path.resolve(__dirname, "dist"),
                filename: "paletools-lite.prod.js"
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
            mode: "production",
            entry: "./src/index.js",
            output: {
                path: path.resolve(__dirname, "dist"),
                filename: "paletools-lite.prod.obfuscated.js"
            },
            plugins: [
                new WebpackObfuscator({ rotateStringArray: true, reservedStrings: ["\s*"] }, [])
            ],
            module: {
                rules: [
                    {
                        test: /\.css$/i,
                        use: ["raw-loader"]
                    },
                    {
                        enforce: "post",
                        use: {
                            loader: WebpackObfuscator.loader,
                            options: {
                                reservedStrings: ["\s*"],
                                rotateStringArray: true
                            }
                        }
                    }
                ]
            }
        }
    ];
};