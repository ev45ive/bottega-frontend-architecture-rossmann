const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/webpack");
const remotesConfig = require("./public/remotes.config.json");

// Reuse the same URLs the runtime fetches remotes.config.json for, so type
// consumption stays in sync with the dynamically registered remotes.
// `alias` must be set explicitly - the dts-plugin keys its internal remote
// map by this field, not by the remoteTypeUrls object key.
const remoteTypeUrls = Object.fromEntries(
  Object.entries(remotesConfig).map(([name, entry]) => {
    const baseUrl = entry.replace(/remoteEntry\.js$/, "");
    return [
      name,
      {
        alias: name,
        api: `${baseUrl}@mf-types.d.ts`,
        zip: `${baseUrl}@mf-types.zip`,
      },
    ];
  }),
);

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 4000,
    static: { directory: path.resolve(__dirname, "public") },
  },
  output: {
    publicPath: "http://localhost:4000/",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        // ts-loader depends on ts.sys, which TypeScript 7 no longer exposes
        loader: "esbuild-loader",
        options: { loader: "tsx", target: "es2020" },
        exclude: /node_modules/,
        // package.json has "type": "module", which forces fully-specified extensionless imports
        resolve: { fullySpecified: false },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shellDynamic",
      // Dynamic strategy: no `remotes` map here — remotes are registered at
      // runtime via @module-federation/enhanced's runtime API instead.
      dts: {
        consumeTypes: { remoteTypeUrls },
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
        "react-redux": { singleton: true, requiredVersion: false },
        "@tanstack/react-query": { singleton: true, requiredVersion: false },

        "@mfe/shared-store": { singleton: true, requiredVersion: "1.0.0" },
        "@mfe/shared-query": { singleton: true, requiredVersion: "1.0.0" },

        "@reduxjs/toolkit": { singleton: true, requiredVersion: false },
        "@tanstack/query-core": { singleton: true, requiredVersion: false },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
