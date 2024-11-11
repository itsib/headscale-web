import { defineConfig, UserConfig,  } from 'vite';
import react from '@vitejs/plugin-react-swc'
import { resolve, join } from 'node:path';
import compression from 'vite-plugin-compression2';
import pluginCp from 'vite-plugin-cp';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa'
import { readFile } from 'node:fs/promises';

/**
 * Vite
 * @see https://vitejs.dev/config/
 */
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const pkgJson = JSON.parse(await readFile('package.json', 'utf8'));
  const manifestJson = JSON.parse(await readFile('manifest.json', 'utf8'));

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
        '@/': resolve(__dirname, 'src'),
        $fonts: resolve(__dirname, 'public/fonts'),
      }
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: mode === 'development',
        },
        manifestFilename: 'site.webmanifest',
        manifest: {
          ...manifestJson,
          name: pkgJson.name,
          description: pkgJson.description,
        },
        // includeAssets: ['/**/*.svg', '/**/*.png', '/fonts/icon-font/**', '/images/**', '/locales/**'],
        workbox: {
          globDirectory: resolve(__dirname, 'dist'),
          globPatterns: [
            '**/*.{js,css,html,png,gz}',
            '**/locales/**/*.json',
            '**/fonts/roboto/Roboto-Bold.woff*',
            '**/fonts/roboto/Roboto-Regular.woff*',
            '**/fonts/roboto/Roboto-Medium.woff*',
            '**/fonts/icon-font/IconFont.woff**',
          ],
          globIgnores: [
            "**/node_modules/**/*",
            "sw.js",
            "workbox-*.js"
          ],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        }
      }),
      compression({
        include: [/\.(js)$/, /\.(css)$/],
        deleteOriginalAssets: false,
        algorithm: 'gzip',
      }),
      pluginCp({
        targets: [
          { src: 'package.json', dest: 'dist' },
          { src: 'LICENSE', dest: 'dist' },
          { src: 'README.md', dest: 'dist' },
        ]
      })
    ],
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            config: join(__dirname, 'tailwind.config.ts'),
          }),
          autoprefixer(),
        ]
      }
    },
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
            ],
            '@tanstack': [
              '@tanstack/query-core',
              '@tanstack/react-query',
              '@tanstack/react-query-persist-client',
            ],
            '@react-just-ui': [
              'react-just-ui',
            ],
            '@react-hook-form': [
              'react-hook-form',
            ],
            '@i18n': [
              'i18next',
              'react-i18next',
              'i18next-http-backend',
              'i18next-browser-languagedetector',
            ],
            '@acl-page': [
              './src/pages/acl/acl-page.tsx',
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
    preview: {
      port: 4005,
      proxy: {

      }
    },
    server: {
      port: 3005,
    }
  } as UserConfig;
})
