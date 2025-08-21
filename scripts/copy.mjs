import fs from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { URL } from 'node:url';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');

async function copy(filename) {
  await fs.cp(join(ROOT, filename), join(ROOT, 'dist', filename), {});

  console.log(`\x1b[0;32m✔ \x1b[0;36m${filename} \x1b[0;37mcopied\x1b[0m`);
}

(async () => {
  await copy('package.json');
  await copy('LICENSE');
  await copy('README.md');
})();
