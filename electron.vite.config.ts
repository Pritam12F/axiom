import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
// Note: If you use Vue, import vue from '@vitejs/plugin-vue' instead

export default defineConfig({
  // 1. Main Process Configuration
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts')
        },
        output: {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        // 🛑 Do NOT include generic wildcards (*) here, just map the raw string prefix
        '@main': resolve(__dirname, 'src/main')
      }
    }
  },

  // 2. Preload Scripts Configuration
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts')
        },
        output: {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        // 🛑 Do NOT include generic wildcards (*) here, just map the raw string prefix
        '@preload': resolve(__dirname, 'src/preload')
      }
    }
  },

  // 3. Renderer Process Configuration (Frontend)
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src')
      }
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/src/main.tsx')
        },
        output: {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    },
    plugins: [react()] // Swappable with other frontend framework plugins
  }
})
