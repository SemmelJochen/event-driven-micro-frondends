const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require("./package.json").dependencies;

module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3002,
        compress: true,
        hot: true,
    },

    output: {
        publicPath: "auto"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react'],
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },


    plugins: [
        // To learn more about the usage of this plugin, please visit https://webpack.js.org/plugins/module-federation-plugin/
        new ModuleFederationPlugin({
            name: 'serviceA',
            filename: 'remoteEntry.js',
            exposes: {
                "./Dashboard": "./src/pages/Dashboard"
            },
            remotes: {
            },
            shared: {
                //this will share all integration dependencies with the remote modules
                ...deps,

                // adds react as shared module
                react: {
                    //eager: true,
                    singleton: true,
                    requiredVersion: deps.react, //optional -- make sure that all react verisons are the same
                },
                "react-dom": {
                    //eager: true,
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                },
            }
        }),
        /*new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: 'body',
            hash: true,
            minify: true,
        }),*/
    ],
};
