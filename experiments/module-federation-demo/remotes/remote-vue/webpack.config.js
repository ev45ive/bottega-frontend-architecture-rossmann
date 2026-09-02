const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/webpack");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 4003,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  output: {
    publicPath: "http://localhost:4003/",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules\/(?!@mfe)/,
        loader: "esbuild-loader",
        options: { loader: "ts", target: "es2020" },
      },
    ],
  },
  plugins: [
    // Vue 3's esm-bundler build expects the bundler to define these feature flags.
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    }),
    new ModuleFederationPlugin({
      name: "remoteVue",
      filename: "remoteEntry.js",
      // Not used for type-checking in this demo (shells consume via ambient
      // declarations / loadRemote()), so skip the cross-build .d.ts generation.
      dts: false,
      exposes: {
        "./Widget": "./src/Widget.ts",
        "./WebComponent": "./src/webComponent.ts",
      },
      shared: {
        vue: { singleton: true, requiredVersion: false },
        "@reduxjs/toolkit": { singleton: true, requiredVersion: false },
        "@tanstack/query-core": { singleton: true, requiredVersion: false },
        "@mfe/shared-store": { singleton: true, requiredVersion: false },
        "@mfe/shared-query": { singleton: true, requiredVersion: false },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
