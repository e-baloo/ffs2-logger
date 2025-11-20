import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['esm'],
    entry: ['src/index.ts'],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    minify: true,
    treeshake: true,
    splitting: true,
    sourcemap: false,
    target: 'es2022',
    esbuildOptions(options) {
        options.legalComments = 'none';
    },
});
