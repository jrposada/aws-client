/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
const config = ({ mode }: { mode: string }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        // prevent vite from obscuring rust errors
        clearScreen: false,

        // Tauri expects a fixed port, fail if that port is not available
        server: {
            port: parseInt(process.env.VITE_PORT!),
            strictPort: true,
        },

        // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
        // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
        // env variables
        envPrefix: [
            'VITE_',
            'TAURI_PLATFORM',
            'TAURI_ARCH',
            'TAURI_FAMILY',
            'TAURI_PLATFORM_VERSION',
            'TAURI_PLATFORM_TYPE',
            'TAURI_DEBUG',
        ],

        build: {
            // Tauri uses Chromium on Windows and WebKit on macOS and Linux
            target:
                process.env.TAURI_PLATFORM == 'windows'
                    ? 'chrome105'
                    : 'safari13',
            // don't minify for debug builds
            minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
            // produce sourcemaps for debug builds
            sourcemap: !!process.env.TAURI_DEBUG,
        },

        plugins: [react()],
        test: {
            environment: 'jsdom',
            coverage: {
                thresholds: {
                    branches: 0,
                    functions: 0,
                    lines: 0,
                },
            },
        },
    });
};

export default config;
