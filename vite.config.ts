import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'FFS2Logger',
            fileName: 'index',
            formats: ['es']
        },
        rollupOptions: {
            external: [
                'node:fs',
                'node:fs/promises',
                'node:path',
                'node:url',
                'fs',
                'fs/promises',
                'path',
                'url'
            ],
            output: {
                globals: {
                    'node:fs': 'fs',
                    'node:fs/promises': 'fs/promises',
                    'node:path': 'path',
                    'node:url': 'url',
                    'fs': 'fs',
                    'fs/promises': 'fs/promises',
                    'path': 'path',
                    'url': 'url'
                }
            }
        },
        target: 'node18',
        minify: true,
        sourcemap: false,
        emptyOutDir: true
    },
    plugins: [
        dts({
            include: ['src/**/*'],
            exclude: ['src/**/*.test.ts'],
            rollupTypes: true,
            insertTypesEntry: true
        })
    ],
    esbuild: {
        platform: 'node',
        legalComments: 'none',
        treeShaking: true
    },
    define: {
        'process.env.NODE_ENV': '"production"'
    }
});