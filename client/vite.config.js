import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  optimizeDeps: {
    include: ['react-phone-input-2'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // Force Vite to process these CJS packages through its ESM pipeline
    // so that default exports resolve correctly in the test environment.
    server: {
      deps: {
        inline: ['@apollo/client', 'react-router-dom'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      // Fail the pipeline if any threshold is below 80%
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.config.*',
        'src/main.jsx',
        'src/App.jsx',
        'cypress/**',
      ],
    },
  },
})
