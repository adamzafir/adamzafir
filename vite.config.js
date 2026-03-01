import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notfound: resolve(__dirname, '404.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
