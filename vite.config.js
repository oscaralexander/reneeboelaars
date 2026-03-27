// import { defineConfig } from 'vite';
import manifestSRI from 'vite-plugin-manifest-sri';
import path from 'path';
import viteCompression from 'vite-plugin-compression';
import ViteRestart from 'vite-plugin-restart';

export default ({ command }) => ({
    base: command === 'serve' ? '' : '/dist/',
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        manifest: true,
        outDir: path.resolve(__dirname, 'web/dist/'),
        rollupOptions: {
            input: {
                app: path.resolve(__dirname, 'src/js/index.js'),
            },
        },
        sourcemap: true,
    },
    plugins: [
        manifestSRI(),
        viteCompression({
            filter: /\.(js|mjs|json|css|map)$/i,
        }),
        ViteRestart({
            reload: ['templates/**/*'],
        }),
    ],
    publicDir: path.resolve(__dirname, 'src/public'),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@css': path.resolve(__dirname, 'src/css'),
            '@js': path.resolve(__dirname, 'src/js'),
            '@npm': path.resolve(__dirname, 'node_modules'),
        },
    },
    server: {
        cors: {
            origin: /https?:\/\/([A-Za-z0-9\-\.]+)?(\.ddev\.site)(?::\d+)?$/,
        },
        host: '0.0.0.0',
        origin: `${process.env.DDEV_PRIMARY_URL.replace(/:\d+$/, '')}:5173`,
        port: 5173,
        strictPort: true,
    },
});
