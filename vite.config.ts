import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
    // Exponha apenas as variáveis necessárias
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
  server: {
    host: true,
    port: 8080,
  },
  esbuild: {
    pure: ['console.log'], // Remove console.log durante o build
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react-map-gl': path.resolve(__dirname, 'node_modules/react-map-gl/dist/mapbox.js'), // Forçando o caminho correto
    },
  },
  optimizeDeps: {
    include: ['react-map-gl'], // Força o Vite a otimizar dependências de forma eficaz
    exclude: [
      "@tabler/icons-react",
      "react-cookie",
      "lodash",
      "axios",
      "next-themes",
      "sonner",
      "react-firebase-hooks/auth",
      "react-qr-code",
      // adicione aqui os outros nomes com erro
    ],
  },
});
