import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
    // E2E specs run under Playwright, not Vitest.
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
  },
});
