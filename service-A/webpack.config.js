const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require("./package.json").dependencies;

module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        //static: path.join(__dirname, 'dist'),
        static: "/public/",
        port: 3002,
        compress: true,
        proxy: {},
        allowedHosts: [`app.localhost`],
    },

    output: {
        publicPath: 'auto',
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
    resolve: {
        alias: {
            "fw.core": path.resolve( "..", __dirname, "fw")
            /*"fw.core.ui.pmui": path.resolve(__dirname, "src/fw/core/pmui"),
            "fw.ui.lib": path.resolve(__dirname, "src/fw/ui/lib"),
            "products.alm.common.ui.lib": path.resolve(__dirname, "src/products/alm/common"),
            "products.alm.basedata.ui.lib": path.resolve(__dirname, "src/products/alm/basedata"),
            "products.alm.nii.ui.lib": path.resolve(__dirname, "src/products/alm/nii"),
            "components.ui.lib": path.resolve(__dirname, "src/components/ui/lib"),*/
        },
    },
    plugins: [
        // To learn more about the usage of this plugin, please visit https://webpack.js.org/plugins/module-federation-plugin/
        new ModuleFederationPlugin({
            name: 'testService',
            filename: 'remoteEntry.js',
            exposes: {
                
            },
            remotes: {
                //integration: "integration@http://localhost:80/remoteEntry.js"
            },
            shared: {
                //...deps,
                react: {
                    singleton: true,
                    //eager: true,
                },
                'react-dom': {
                    singleton: true,
                    //eager: true,
                }
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
};
