import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  build: {
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'vendor-antd';
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            return 'vendor-others';
          }
          // Route chunks
          if (id.includes('pages/login')) {
            return 'page-login';
          }
          if (id.includes('pages/register')) {
            return 'page-register';
          }
          if (id.includes('pages/projectManager')) {
            return 'page-projects';
          }
        }
      }
    },
    // Optimize CSS output
    cssCodeSplit: true,
    // Minify options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    // Report compressed size
    reportCompressedSize: true,
    // Chunk size warning threshold
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'antd',
      '@ant-design/icons',
      'axios',
    ],
  },
});
