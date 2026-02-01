import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**', // Exclude E2E tests from unit tests
      '**/*.e2e.{ts,tsx}',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'e2e/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        '**/dist/',
      ],
    },
  },
  // Use separate TypeScript config for tests
  esbuild: {
    target: 'es2020',
  },
})
