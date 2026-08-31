import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
import ESLintWebpackPlugin from 'eslint-rspack-plugin';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { initEmptyVars, transformEnvVariables } from './src/utils/bundler';

let { parsed = {} } = dotenv.config({ path: './.env' });
parsed = initEmptyVars(parsed);

const transformedEnvVariables = transformEnvVariables(parsed);

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['>0.2%', 'not dead', 'not op_mini all'];

export default defineConfig({
    mode: 'production',
    context: __dirname,

    entry: {
        main: './src/index.tsx',
    },
    devtool: false,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
        assetModuleFilename: 'static/media/[name].[contenthash:8][ext][query]',
        clean: true,
        uniqueName: 'mappingModuleApp',
    },
    resolve: {
        extensions: ['...', '.ts', '.tsx', '.js', '.jsx'],
        modules: [
            'node_modules',
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src'),
        ],
        fallback: {
            path: require.resolve('path-browserify'),
        },
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            prettier: false,
                            svgo: false,
                            svgoConfig: {
                                plugins: [{ removeViewBox: false }],
                            },
                            titleProp: true,
                            ref: true,
                        },
                    },
                    'url-loader',
                ],
            },
            {
                test: /\.(jsx?|tsx?)$/,
                use: [
                    {
                        loader: 'builtin:swc-loader',
                        options: {
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true,
                                },
                                transform: {
                                    react: {
                                        runtime: 'automatic',
                                    },
                                },
                            },
                            env: { targets },
                        },
                    },
                ],
            },
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    rspack.CssExtractRspackPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            implementation: require.resolve('sass-embedded'),

                            sassOptions: {
                                loadPaths: [path.resolve(__dirname, 'node_modules')],
                            },
                        },
                    },
                ],
                type: 'javascript/auto',
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
                type: 'asset',
            },
        ],
    },
    plugins: [
        new rspack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            ...transformedEnvVariables,
        }),
        new rspack.CssExtractRspackPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        new rspack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new rspack.CopyRspackPlugin({
            patterns: [
                {
                    from: 'public',
                    globOptions: {
                        ignore: ['**/*.html', '**/*dev.js'],
                    },
                },
                {
                    from: 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
                    to: 'pdfjs/pdf.worker.mjs',
                },
            ],
        }),
        new rspack.HtmlRspackPlugin({
            template: 'public/index.html',
            templateParameters: {
                ...parsed,
            },
        }),
        new TsCheckerRspackPlugin({
            issue: { exclude: [{ file: '**/*.test.tsx' }, { file: '**/*.test.ts' }] },
        }),
        new ESLintWebpackPlugin({
            extensions: ['ts', 'tsx'],
            configType: 'flat',
        }),
        new rspack.WarnCaseSensitiveModulesPlugin(),
    ].filter(Boolean),
    optimization: {
        minimizer: [
            new rspack.SwcJsMinimizerRspackPlugin(),
            new rspack.LightningCssMinimizerRspackPlugin({
                minimizerOptions: { targets },
            }),
        ],
    },
});