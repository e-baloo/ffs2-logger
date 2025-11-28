import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'coverage/**',
        'dist/**',
        'node_modules/**',
        'examples/**',
        'docs/**',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
    include: ['src/**/*.test.ts'],
    globals: true,
  },
});