import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [VitePWA(), react(), mkcert(), tsconfigPaths()],
  server: {
    host: true,
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
      },
    },
  },
});
