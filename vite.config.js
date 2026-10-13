import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-assets-to-dist',
      closeBundle() {
        const srcDir = path.resolve('assets');
        const destDir = path.resolve('dist/assets');
        if (fs.existsSync(srcDir)) {
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.cpSync(srcDir, destDir, { recursive: true });
        }
      }
    }
  ],
  base: './',
  server: {
    port: 5173,
    open: true
  }
});
