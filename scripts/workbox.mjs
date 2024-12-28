import { generateSW } from 'workbox-build';
import { join } from 'node:path';
import { mkdir, rm } from 'node:fs/promises';

const filename = 'sw.js';
const outputDir = 'dist-sw';
const cwd = process.cwd();

(async () => {
  await rm(join(cwd, outputDir), { force: true, recursive: true });
  await mkdir(join(cwd, outputDir), { recursive: true });


  const { warnings, filePaths } = await generateSW({
    mode: 'development',
    globDirectory: join(process.cwd(), 'dist'),
    globPatterns: [
      '**/*.{js,css,html}',
      'locales/**/*.{json,svg}',
      'screenshot.png'
    ],
    cacheId: Math.random().toString(36).slice(2),
    cleanupOutdatedCaches: true,
    clientsClaim: false,
    modifyURLPrefix: { '': '/' },
    navigateFallback: 'index.html',
    swDest: join(cwd, outputDir, filename),
  });

  if (warnings) {
    warnings.forEach(console.warn);
  }

  if (filePaths) {
    filePaths.forEach(console.log);
  }

  console.log('\x1b[0;92mDone!\x1b[0m');


})()