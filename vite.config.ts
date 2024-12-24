import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { join, resolve } from 'node:path';
import compression from 'vite-plugin-compression2';
import pluginCp from 'vite-plugin-cp';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';
import { readFile } from 'node:fs/promises';
import * as fs from 'node:fs';

/**
 * Vite
 * @see https://vitejs.dev/config/
 */
export default defineConfig(async ({ mode, command }): Promise<UserConfig> => {
  const env = loadEnv(mode, process.cwd());
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  const webmanifest = JSON.parse(await readFile('manifest.webmanifest', 'utf8'));
  const isDevSSL = command === 'serve' && fs.existsSync('cert');

  return {
    clearScreen: false,
    logLevel: 'info',
    appType: 'spa',
    publicDir: 'public',
    define: {
      'import.meta.env.NODE_ENV': JSON.stringify(mode),
      'import.meta.env.VITE_ACCESS_URL': JSON.stringify(env.VITE_ACCESS_URL),
      'import.meta.env.VITE_ACCESS_TOKEN': JSON.stringify(env.VITE_ACCESS_TOKEN),
      'import.meta.env.VITE_BUILD_ID': JSON.stringify(Math.floor(Math.random() * 10000000).toString(16).toUpperCase()),
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
        base: '/',
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        strategies: 'generateSW', //'generateSW',
        // srcDir: 'src',
        // filename: 'sw.ts',
        devOptions: {
          enabled: mode === 'development',
          type: 'module',
          navigateFallback: 'index.html',
          resolveTempFolder: () => join(process.cwd(), 'dist'),
        },
        manifest: {
          ...webmanifest,
          name: pkg.name,
          description: pkg.description,
        },
        workbox: {
          globDirectory: join(process.cwd(), 'dist'),
          globPatterns: [
            '**/*.{js,css,html}',
            'locales/**/*.{json,svg}',
            'screenshot.png'
          ],
          modifyURLPrefix: { '': '/' },
          navigateFallback: 'index.html',
          disableDevLogs: true,
          runtimeCaching: [
            {
              urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)(?:\?hash=\d{6,8})?$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-font-assets',
                expiration: {
                  maxEntries: 4,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
              },
            },
            {
              urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-content',
                expiration: {
                  maxEntries: 64,
                  maxAgeSeconds: 24 * 60 * 60 * 30, // 1 month
                },
              },
            },
            // {
            //   urlPattern: /\.js$/i,
            //   handler: 'StaleWhileRevalidate',
            //   options: {
            //     cacheName: 'static-js-assets',
            //     expiration: {
            //       maxEntries: 32,
            //       maxAgeSeconds: 24 * 60 * 60, // 24 hours
            //     },
            //   },
            // },
            // {
            //   urlPattern: /\.css$/i,
            //   handler: 'StaleWhileRevalidate',
            //   options: {
            //     cacheName: 'static-style-assets',
            //     expiration: {
            //       maxEntries: 32,
            //       maxAgeSeconds: 24 * 60 * 60, // 24 hours
            //     },
            //   },
            // },
            {
              handler: 'NetworkOnly',
              urlPattern: /\/api\/.*$/,
              method: 'POST',
              options: {
                backgroundSync: {
                  name: 'myQueueName',
                  options: {
                    maxRetentionTime: 24 * 60,
                  },
                },
              },
            },
          ],
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
    optimizeDeps: {
      include: ['react-dom'],
    },
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
    preview: {
      port: 4005,
    },
    server: {
      port: 3005,
      host: 'localhost',
      keepAlive: true,
      https: isDevSSL ? {
        cert: './cert/localhost.crt',
        key: './cert/localhost.key',
        serverName: 'localhost',
      } : undefined,
    }
  } as UserConfig;
});
