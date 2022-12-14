// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 02/02/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = (env) => { 
    
  return {
    name: "esquisse",
    target: "web",
    entry: ["./src/main.tsx"],
    output: {
      filename: 'esquisse.js',
      path: path.resolve(__dirname, "build"),
      clean: true,
    },
    mode: env.dev ? "development" : "production",
    devtool: env.dev ? "eval-source-map" : false,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader', 
              options: {
                onlyCompileBundledFiles: true
              }
            }
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          include: path.resolve(__dirname, './node_modules/bootstrap-icons/font/fonts'),
          use: {
            loader: 'file-loader',
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html")
      }),
      new FaviconsWebpackPlugin('resources/favicon.png'),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', ".js", ".jsx"],
      roots: [
        path.resolve(__dirname, './src/'),
      ],  
    },
    
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'build'),
        },
        {
          directory: path.join(__dirname, 'library'),
          publicPath: '/data',
        }
      ],
      compress: true,
      port: 8000,
    },
  }
};
