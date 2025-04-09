import { defineConfig, UserConfig } from 'vite';
import preact from '@preact/preset-vite';
import { join, resolve } from 'node:path';
import { createHtmlPlugin } from 'vite-plugin-html';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomBytes } from 'crypto';

/**
 * Vite
 * @see https://vitejs.dev/config/
 */
export default defineConfig(async ({ mode, command }): Promise<UserConfig> => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  const webmanifest = JSON.parse(await readFile('manifest.webmanifest', 'utf8'));
  const isDevSSL = command === 'serve' && existsSync('cert');

  return {
    clearScreen: false,
    logLevel: 'info',
    appType: 'spa',
    publicDir: 'public',
    define: {
      'import.meta.env.NODE_ENV': JSON.stringify(mode),
      'import.meta.env.VERSION': JSON.stringify(pkg.version),
      'import.meta.env.BUILD_ID': JSON.stringify(randomBytes(32).toString('hex')),
    },
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
        $fonts: resolve(__dirname, 'public/fonts'),
        '@app-types': resolve(__dirname, 'src/types/index.ts'),
        '@app-config': resolve(__dirname, 'src/config.ts'),
        '@app-components': resolve(__dirname, 'src/components'),
        '@app-hooks': resolve(__dirname, 'src/hooks'),
        '@app-context': resolve(__dirname, 'src/context'),
        '@app-utils': resolve(__dirname, 'src/utils'),
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            config: join(__dirname, 'tailwind.config.ts'),
          }),
          autoprefixer(),
        ],
      },
    },
    esbuild: { legalComments: 'none' },
    optimizeDeps: {
      include: [...Object.keys(pkg.dependencies)],
    },
    build: {
      target: 'esnext',
      minify: mode === 'production' ? 'esbuild' : false,
      copyPublicDir: true,
      emptyOutDir: true,
      cssCodeSplit: false,
      modulePreload: false,
      chunkSizeWarningLimit: 200,
      assetsInlineLimit: 0,
    },
    plugins: [
      createHtmlPlugin({
        entry: 'src/index.tsx',
        template: 'index.html',
        inject: {
          data: {
            APP_NAME: pkg.config.name,
            APP_DESCRIPTION: pkg.description,
          }
        }
      }),
      preact({
        reactAliasesEnabled: true,
        devToolsEnabled: mode !== 'production',
        prefreshEnabled: command === 'serve',
        babel: {
          plugins: [
            [
              '@babel/plugin-transform-react-jsx-source',
              {
                pragma: 'h',
                pragmaFrag: 'Fragment',
              },
            ],
          ],
        },
      }),
      VitePWA({
        base: '/',
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        strategies: 'generateSW', //'generateSW',
        devOptions: {
          enabled: false,
        },
        manifest: {
          ...webmanifest,
          name: pkg.config.name,
          short_name: pkg.config['short-name'],
          description: pkg.description,
          theme_color: pkg.config['theme-color'],
          background_color: pkg.config['background-color'],
        },
        workbox: {
          globDirectory: join(process.cwd(), 'dist'),
          globPatterns: [
            'animations/*.json',
            'assets/*.{css,js}',
            'fonts/**/*.{woff2,woff,ttf}',
            'locales/**/*.{json,svg}',
            'images/*.svg',
            '*.{png,ico,svg,html,webp}',
          ],
          modifyURLPrefix: { '': '/' },
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/metrics/, /^\/api/, /^\/terminal/],
          disableDevLogs: true,
          runtimeCaching: [
            {
              urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)(?:\?hash=\d{6,8})?$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-font-assets',
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
              },
            },
            {
              urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-content',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 24 * 60 * 60 * 30, // 1 month
                },
              },
            },
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'external-packages',
                expiration: {
                  maxEntries: 4,
                  maxAgeSeconds: 24 * 60 * 60 * 30, // 1 month
                },
              },
            },
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
        },
      }),
    ],
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
      port: 3008,
      host: 'localhost',
      keepAlive: true,
      https: isDevSSL ? {
        cert: './cert/localhost.crt',
        key: './cert/localhost.key',
        serverName: 'localhost',
      } : undefined,
    },
  } as UserConfig;
});
