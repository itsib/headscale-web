import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { URL } from 'node:url'

const ROOT_PROJECT = resolve(dirname(new URL(import.meta.url).pathname), '..');

async function readVersion() {
  const pkg = JSON.parse(await readFile(join(ROOT_PROJECT, 'package.json'), { encoding: 'utf8' }));
  return pkg.version;
}

async function updateReadmeVersion(version) {
  const readme = await readFile(join(ROOT_PROJECT, 'README.md'), 'utf8');

  const patched = readme.replace(/version-\d+\.\d+\.\d+-blue\.svg/, `version-${version}-blue.svg`);

  await writeFile(join(ROOT_PROJECT, 'README.md'), patched, 'utf8');

  console.log(`\x1b[0;92m✔ README.md version updated to ${version}\x1b[0m`);
}

async function updateDockerfileVersion(version) {
  const dockerfile = await readFile(join(ROOT_PROJECT, 'Dockerfile'), 'utf8');

  const patched = dockerfile.replace(/^ARG\sVERSION=\d+\.\d+\.\d+/, `ARG VERSION=${version}`);

  await writeFile(join(ROOT_PROJECT, 'Dockerfile'), patched, 'utf8');

  console.log(`\x1b[0;92m✔ Dockerfile version updated to ${version}\x1b[0m`);
}

(async () => {
  const version = await readVersion();

  await updateReadmeVersion(version);
  await updateDockerfileVersion(version);
})();