// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// ---------------------------
// 🌐 VITE CONFIG
// ---------------------------

export default defineConfig({
  plugins: [vue()],

  // ===========================
  // 🚀 SERVER PORTS
  // ===========================
  // Uncomment the one you want to use:
  // port: 3000, 4000 // production on  3000 and development on 4000

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@views': path.resolve(__dirname, './src/views')
    }
  },

  server: {
    //port: 5173,   // 👈 force Vite to always use 5173 in production
    port: 5174,   // 👈 force Vite to always use 5174 in Developement 
    host: '0.0.0.0', 

    // ===========================
    // 🔗 PROXY SETTINGS
    // ===========================
    proxy: {
      '/api': {
        //target: 'https://crs.xnovity.com:3000', // for production
        target: 'http://192.168.0.101:4000',  // for development
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/uploads': {
      //target: 'https://crs.xnovity.com:3000', // for production
      target: 'http://192.168.0.101:4000',  // for development
      changeOrigin: true,
      rewrite: (path) => path,
    },
      '/static': {
        //target: 'https://crs.xnovity.com:3000', // for production
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
      'crs.xnovity.com',
      'http://crs.xnovity.com',
      'https://crs.xnovity.com'
    ]
  }
})
