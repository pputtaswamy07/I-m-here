import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      // React Compiler adds memoisation branches that skew coverage — disable in tests.
      mode !== 'test' && babel({ presets: [reactCompilerPreset()] }),
    ].filter(Boolean),
    optimizeDeps: {
      include: ['react-phone-input-2'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      // CSS imports become empty modules in tests — prevents V8 source-map
      // offsets that otherwise misattribute coverage to adjacent JS lines.
      css: false,
      // Force Vite to process these CJS packages through its ESM pipeline
      // so that default exports resolve correctly in the test environment.
      server: {
        deps: {
          inline: ['@apollo/client', 'react-router-dom'],
        },
      },
      coverage: {
        provider: 'istanbul',
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
  }
})
