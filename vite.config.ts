import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'RainbowkitContract',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'wagmi', 'viem', 'zustand'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          wagmi: 'wagmi',
          viem: 'viem',
          zustand: 'zustand',
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
}); 