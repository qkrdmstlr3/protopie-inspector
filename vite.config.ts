import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { addHmr } from './utils/add-hmr';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  plugins: [react(), addHmr({ background: true, view: true })],
  publicDir,
  build: {
    outDir,
    rollupOptions: {
      input: {
        content: resolve(pagesDir, 'content', 'index.ts'),
        popup: resolve(pagesDir, 'popup', 'index.html'),
      },
      watch: {
        include: ['src/**', 'vite.config.ts'],
      },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: 'assets/js/[name].[hash].js',
      },
    },
  },
});
