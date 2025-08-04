import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // 构建时定义全局常量
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    '__APP_VERSION__': JSON.stringify('1.0.0'),
    '__BUILD_TIME__': JSON.stringify(new Date().toISOString())
  },
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // 使用 esbuild 压缩器，更快更稳定
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          charts: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  }
});
