import { defineConfig } from 'vitest/config';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [viteReact()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    // Node's own `localStorage` global would otherwise shadow jsdom's (and is undefined without
    // --localstorage-file).
    execArgv: ['--no-experimental-webstorage'],
  },
});
