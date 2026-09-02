import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";

const config: Configuration & { devServer?: DevServerConfiguration } = {
  mode: "development",
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        // ts-loader depends on ts.sys, which TypeScript 7 no longer exposes
        loader: "esbuild-loader",
        options: { loader: "ts", target: "es2020" },
        exclude: /node_modules/,
        // package.json has "type": "module", which forces fully-specified extensionless imports
        resolve: { fullySpecified: false },
      },
    ],
  },
  devServer: {
    port: 4010,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "shellStatic",
      remotes: {
        remoteJs: "remoteJs@http://localhost:4001/remoteEntry.js",
      },
    }),
  ],
};

export default config;
