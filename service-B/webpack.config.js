const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require("./package.json").dependencies;

module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        //static: path.join(__dirname, 'dist'),
        static: {
            directory: path.join(__dirname, 'public'),
            publicPath: "/serviceb"
        },
        port: 3003,
        compress: true,
        hot: true,
        proxy: {},
        allowedHosts: [`app.localhost`],
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/serviceb",
        filename: '[name].[hash:8].js',
        sourceMapFilename: '[name].[hash:8].map',
        chunkFilename: '[id].[hash:8].js'
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
            name: 'serviceB',
            filename: 'remoteEntry.js',
            exposes: {
                
            },
            remotes: {
                //you should always use relative urls (also for publicPath)
                navservice: "navservice@/remoteEntry.js"
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
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: 'body',
            hash: true,
            minify: true,
        }),
    ],
};
