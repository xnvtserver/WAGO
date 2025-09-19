import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@stores': path.resolve(__dirname, './src/stores')   // ✅ add this
    }
  },
    server: {
    port: 5177,
    host: '0.0.0.0', 

    // ===========================
    // 🔗 PROXY SETTINGS
    // ===========================
    proxy: {
      //   '/': {
      //   //target: 'https://lms.xnovity.com:3000', // for production
      //   target: 'http://localhost:4000',  // for development
      //   changeOrigin: true,
      //   rewrite: (path) => path
      // },
      '/api': {
        //target: 'https://lms.xnovity.com:3000', // for production
        target: 'http://192.168.0.101:4000',  // for development
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/uploads': {
      //target: 'https://lms.xnovity.com:3000', // for production
      target: 'http://192.168.0.101:4000',  // for development
      changeOrigin: true,
      rewrite: (path) => path,
    },
      '/static': {
        //target: 'https://lms.xnovity.com:3000', // for production
        target: 'http://192.168.0.101:4000',  // for development
        changeOrigin: true,
        rewrite: (path) => path
      }
    },

    // ===========================
    // 🌍 NETWORK / HOSTING
    // ===========================
    historyApiFallback: true,
    allowedHosts: [
      'localhost',
      '192.168.0.101',
      'lms.xnovity.com',
      'http://lms.xnovity.com',
      'https://lms.xnovity.com'
    ]
  }
})
