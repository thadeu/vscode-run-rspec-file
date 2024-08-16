import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['spec/**/*.test.ts'],
    threads: false,
    globals: true,
  },
  resolve: {
    alias: {
      vscode: 'spec/__mocks__/vscode.js',
    },
  },
})
