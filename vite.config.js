import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notfound: resolve(__dirname, '404.html'),
        references: resolve(__dirname, 'references/index.html'),
        reference2: resolve(__dirname, 'references/2/index.html'),
        reference3: resolve(__dirname, 'references/3/index.html'),
        reference4: resolve(__dirname, 'references/4/index.html'),
        referenceRoot: resolve(__dirname, 'references/root/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
