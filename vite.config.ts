import { resolve } from 'path'
// import { defineConfig } from 'vite'
import { defineConfig } from 'vitest/config'

import tsconfigPaths from 'vite-tsconfig-paths'

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
