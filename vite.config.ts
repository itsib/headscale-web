import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path';
import compression from 'vite-plugin-compression2';

/**
 * Vite
 * @see https://vitejs.dev/config/
 */
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  return {
    clearScreen: false,
    logLevel: 'info',
    appType: 'spa',
    publicDir: 'public',
    define: {
      'import.meta.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
        $fonts: `${resolve(__dirname, 'public/fonts')}/`,
      }
    },
    plugins: [
      react(),
      compression({
        include: [/\.(js)$/, /\.(css)$/],
        deleteOriginalAssets: false,
        algorithm: 'gzip',
      }),
    ],
    esbuild: { legalComments: 'none' },
    build: {
      target: 'esnext',
      minify: mode === 'production' ? 'esbuild' : false,
      copyPublicDir: true,
      emptyOutDir: true,
      cssCodeSplit: true,
      rollupOptions: {
        treeshake: 'recommended',
        output: {
          manualChunks: {
            '@react': [
              'react',
              'react-dom',
              'react-router-dom',
              'react-hook-form',
              '@tanstack/query-core',
              '@tanstack/react-query',
              '@tanstack/react-query-persist-client',
            ],
            '@react-just-ui': [
              'react-just-ui',
            ],
            '@react-spring': [
              '@react-spring/web',
            ],
            '@lottie-web': [
              'lottie-web/build/player/lottie_light'
            ],
            '@i18n': [
              'i18next',
              'react-i18next',
              'i18next-http-backend',
              'i18next-browser-languagedetector',
            ],
            '@codemirror': [
              '@codemirror/commands',
              '@codemirror/language',
              '@codemirror/state',
              '@codemirror/view',
              '@lezer/highlight',
              '@lezer/lr',
            ],
          },
        },
      },
      chunkSizeWarningLimit: 1500,
      assetsInlineLimit: 0,
    },
    test: {
      css: false,
      include: ['src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
      globals: true,
      environment: 'node',
      restoreMocks: true,
      watch: false,
    },
    optimizeDeps: {
      include: ['react-dom'],
    },
  } as UserConfig;
})
