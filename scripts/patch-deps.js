import fs from 'node:fs/promises';
import { join } from 'node:path';

const ROOT_PATH = join(process.cwd(), 'node_modules');

const CONFIG = [
  {
    packages: ['react-dom'],
    filenames: ['react-dom-client.development.js', 'react-dom-profiling.development.js'],
    comment: 'Warning about dev environment',
    replace: {
      pattern:
        /\s*console\.info\(\s+["']%cDownload the React DevTools for a better development experience: https:\/\/react\.dev\/link\/react-devtools["']/g,
      replace: ' !1 && \n console.info(""',
    },
  },
];

function isTest() {
  return Boolean(~process.argv.indexOf('--test') || ~process.argv.indexOf('-t'));
}

/**
 * Find a line in the file and replace it with replacer.
 *
 * @param {string} filepath
 * @param {{ pattern:RegExp,replace:string }} replacer
 * @returns {Promise<boolean>}
 */
async function searchAndPatch(filepath, replacer) {
  const contents = await fs.readFile(filepath, { encoding: 'utf8' });

  replacer.pattern.lastIndex = 0;
  const result = replacer.pattern.exec(contents);
  if (!result) {
    return false;
  }

  const found = result[0];
  let patched = contents.slice(0, result.index);
  patched += replacer.replace;
  patched += contents.slice(result.index + found.length);

  if (isTest()) {
    console.log('\x1b[0;97mFile: %s\x1b[0m', filepath);
    const start = result.index - 100;
    const end = result.index + found.length + 100;

    console.log('Before:\n\x1b[2;64m\n%s\x1b[0m', contents.slice(start, end));

    console.log('After:\n\x1b[2;64m\n%s\x1b[0m', patched.slice(start, end));
    return false;
  } else {
    await fs.writeFile(filepath, patched, { encoding: 'utf8' });
  }
  return true;
}

/**
 *
 * @param {string} directory
 * @param {(string)[]} filenames
 * @param {{ pattern:RegExp,replace:string }} replace
 * @returns {Promise<Dirent[]>}
 */
async function searchFiles(directory, filenames, replace) {
  const files = await fs
    .readdir(directory, { withFileTypes: true, recursive: true, encoding: 'utf8' })
    .catch(() => []);
  const patched = [];

  for (const file of files) {
    if (!file.isFile() || !filenames.includes(file.name)) {
      continue;
    }

    const absolute = join(file.parentPath, file.name);
    const result = await searchAndPatch(absolute, replace);
    if (!result) {
      continue;
    }

    patched.push(file.name);
  }

  return patched;
}

async function handleConfig({ packages, filenames, replace }) {
  const results = [];

  for (const pkg of packages) {
    const pkgPath = join(ROOT_PATH, pkg);
    const patchedFilenames = await searchFiles(pkgPath, filenames, replace);
    if (!patchedFilenames.length) {
      continue;
    }
    results.push(...patchedFilenames.map((filename) => ({ filename, pkg })));
  }

  return results;
}

async function run(_configs) {
  console.log(`\n\x1b[0;36mChecking packages to patch vulnerable files\x1b[0m`);
  let isPatched = false;

  for (const _config of _configs) {
    const patched = await handleConfig(_config);
    for (const file of patched) {
      console.log(
        `\x1b[0;32m✔\x1b[0m 📦 \x1b[2;93m%s\x1b[0m 💾 \x1b[2;93m%s\x1b[0m \x1b[2;64m%s\x1b[0m`,
        file.pkg.padEnd(28),
        file.filename.padEnd(28),
        _config.comment
      );
      isPatched = true;
    }
  }

  if (isPatched) {
    console.log('\x1b[0;32m  Done!\x1b[0m');
  } else {
    console.log("\x1b[0;32m  No files found. It's good.\x1b[0m");
  }
}

run(CONFIG)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
