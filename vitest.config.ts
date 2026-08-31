import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Match the baseUrl from tsconfig.json
            assets: path.resolve(__dirname, './src/assets'),
            common: path.resolve(__dirname, './src/common'),
            components: path.resolve(__dirname, './src/components'),
            core: path.resolve(__dirname, './src/core'),
            Layout: path.resolve(__dirname, './src/Layout'),
            mfe: path.resolve(__dirname, './src/mfe'),
            pages: path.resolve(__dirname, './src/pages'),
            utils: path.resolve(__dirname, './src/utils'),
            tests: path.resolve(__dirname, './src/tests'),
            '@ey-xd/motif-components': path.resolve(
                __dirname,
                './node_modules/@ey-xd/motif-components',
            ),
            '@ey-xd/motif-wc-react': path.resolve(
                __dirname,
                './node_modules/@ey-xd/motif-wc-react',
            ),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts',
        testTimeout: 10000, // Increase timeout for jsdom compatibility
        //TODO: remove unwanted coverage reporters after checking CICD pipeline
        coverage: {
            reporter: ['lcov', 'clover', 'text', 'json', 'html'],
        },
    },
});
