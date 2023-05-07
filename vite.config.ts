import { defineConfig } from 'vitest/config'
// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    setupFiles: './config/setup.js',
    testTimeout: 60000,
    include: ['**/*.{test,spec}.{ts,tsx}'],
  },
  plugins: [],
})
