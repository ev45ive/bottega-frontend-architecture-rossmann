const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const remotesConfig = require('./public/remotes.config.json');

// Reuse the same URLs the runtime fetches remotes.config.json for, so type
// consumption stays in sync with the dynamically registered remotes.
const remoteTypeUrls = Object.fromEntries(
  Object.entries(remotesConfig).map(([name, entry]) => {
    const baseUrl = entry.replace(/remoteEntry\.js$/, '');
    return [name, { api: `${baseUrl}@mf-types.d.ts`, zip: `${baseUrl}@mf-types.zip` }];
  }),
);

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    port: 4010,
    static: { directory: path.resolve(__dirname, 'public') },
  },
  output: {
    publicPath: 'http://localhost:4010/',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules\/(?!@mfe)/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shellDynamic',
      // Dynamic strategy: no `remotes` map here — remotes are registered at
      // runtime via @module-federation/enhanced's runtime API instead.
      dts: {
        consumeTypes: { remoteTypeUrls },
      },
      shared: {
        // '@reduxjs/toolkit': shared['@reduxjs/toolkit'],
        // '@tanstack/query-core': shared['@tanstack/query-core'],
        // '@mfe/shared-store': shared['@mfe/shared-store'],
        // '@mfe/shared-query': shared['@mfe/shared-query'],
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
};
