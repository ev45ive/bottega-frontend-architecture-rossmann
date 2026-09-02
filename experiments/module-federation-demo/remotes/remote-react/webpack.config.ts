import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";
import path from "path";

const config: Configuration & { devServer?: DevServerConfiguration } = {
  mode: "development",
  entry: "./src/index.ts",
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
  devServer: {
    port: 4002,
    // CORS:
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  output: {
    publicPath: "http://localhost:4002/",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "remoteReact",
      filename: "remoteEntry.js",
      exposes: {
        "./Widget": "./src/Widget.tsx",
        "./WebComponent": "./src/WebComponent.tsx",
      },
      dts: {
        generateTypes: true,
      },
    }),
  ],
};

export default config;
