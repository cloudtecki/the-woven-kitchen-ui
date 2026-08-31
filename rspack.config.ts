import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import RefreshPlugin from "@rspack/plugin-react-refresh";
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin";
import * as path from "path";
import * as dotenv from "dotenv";
import { transformEnvVariables } from "./src/utils/bundler";

const port = "9001";

// Load environment variables
const { parsed = {} } = dotenv.config({ path: "./.env.development" });
const transformedEnvVariables = transformEnvVariables(parsed);

// Browserslist target
const targets = ["last 1 chrome version"];

export default defineConfig({
    mode: "development",
    context: __dirname,

    entry: {
        main: "./src/index.tsx",
    },

    devtool: "cheap-module-source-map",

    devServer: {
        open: false,
        client: {
            overlay: false, // hide popup errors
        },
        port,
        allowedHosts: "all",
        historyApiFallback: true,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods":
                "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        },
    },

    output: {
        path: path.resolve(__dirname, "build"),
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[hash][ext][query]",
        uniqueName: "mappingModuleApp",
        clean: true,
    },

    resolve: {
        extensions: ["...", ".ts", ".tsx", ".js", ".jsx"],
        modules: [
            "node_modules",
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, "src"),
        ],
        fallback: {
            path: require.resolve("path-browserify"),
        },
    },

    watchOptions: {
        ignored: /node_modules/,
    },

    module: {
        rules: [
            // SVG support (React component import)
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                use: [
                    {
                        loader: "@svgr/webpack",
                        options: {
                            svgo: false,
                            prettier: false,
                            titleProp: true,
                            ref: true,
                        },
                    },
                    "url-loader",
                ],
            },

            // TypeScript / TSX compiled by SWC
            {
                test: /\.(jsx?|tsx?)$/,
                use: [
                    {
                        loader: "builtin:swc-loader",
                        options: {
                            sourceMaps: true,
                            jsc: {
                                parser: {
                                    syntax: "typescript",
                                    tsx: true,
                                },
                                transform: {
                                    react: {
                                        runtime: "automatic",
                                        development: true,
                                        refresh: true,
                                    },
                                },
                            },
                            env: { targets },
                        },
                    },
                ],
            },

            // CSS / SCSS / SASS
            {
                test: /\.(css|scss|sass)$/,
                type: "javascript/auto",
                use: [
                    rspack.CssExtractRspackPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "resolve-url-loader",
                        options: { sourceMap: true },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require.resolve("sass-embedded"),
                            sourceMap: true,
                            sassOptions: {
                                loadPaths: [path.resolve(__dirname, "node_modules")],
                            },
                        },
                    },
                ],
            },

            // Images, Fonts
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
                type: "asset",
            },
        ],
    },

    plugins: [
        // ENV variables
        new rspack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development"),
            ...transformedEnvVariables,
        }),

        // Extract CSS
        new rspack.CssExtractRspackPlugin({
            filename: "static/css/[name].css",
            chunkFilename: "static/css/[name].chunk.css",
        }),

        // Ignore moment locales
        new rspack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),

        // Copy static assets
        new rspack.CopyRspackPlugin({
            patterns: [
                {
                    from: "public",
                    globOptions: { ignore: ["**/*.html"] },
                },
                {
                    from: "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
                    to: "pdfjs/pdf.worker.mjs",
                },
            ],
        }),

        // HTML template
        new rspack.HtmlRspackPlugin({
            chunks: ["main"],
            template: "public/index.html",
            templateParameters: {
                ...parsed,
            },
        }),

        // Type checking
        new TsCheckerRspackPlugin({
            issue: {
                exclude: [
                    { file: "**/*.test.tsx" },
                    { file: "**/*.test.ts" },
                ],
            },
        }),

        // Case-sensitive file warnings
        new rspack.WarnCaseSensitiveModulesPlugin(),

        // React Fast Refresh
        new RefreshPlugin(),
    ],
});
