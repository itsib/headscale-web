import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as _sirv from 'sirv';
import * as https from 'https';
import { IncomingMessage, ServerResponse } from 'node:http';

const sirv = (_sirv as any).default as (path: string, params: Record<string, any>) => ((req, res, next) => void);

const DIST_DIR = join(process.cwd(), 'dist');

const assets = sirv(join(DIST_DIR, 'assets'), {
  maxAge: 31536000,
  gzip: true,
  immutable: true,
  extensions: ['gz', 'css', 'js'],
});

const root = sirv(DIST_DIR, {
  maxAge: 0,
  immutable: false,
  single: true,
});

async function getCert(): Promise<{ cert: string, key: string } | undefined> {
  const dir = join(process.cwd(), 'cert');

  try {
    await access(dir);
    return {
      cert: await readFile(join(dir, 'localhost.crt'), 'utf8'),
      key: await readFile(join(dir, 'localhost.key'), 'utf8'),
    };
  } catch {
    return undefined;
  }
}

(async () => {
  const port = 4006;
  const cert = await getCert();
  if (!cert) {
    throw new Error('No certificate provided');
  }

  async function fallback(req: IncomingMessage, res: ServerResponse) {
    const indexHTML = await readFile(join(DIST_DIR, 'index.html'), 'utf8');

    console.log(req.url);
    res.setHeader('cache-control', 'public, max-age=0, must-revalidate');
    res.setHeader('content-type', 'text/html');
    res.write(indexHTML);
    res.end();
  }

  const pipe: ((req: IncomingMessage, res: ServerResponse, next?: () => void) => void)[] = [assets, root, fallback];

  https
    .createServer(cert, async function (req, res) {
      for (let i = 0; i < pipe.length; i++) {
        let isNextCalled = false;

        await pipe[i].call(null, req, res, () => (isNextCalled = true));

        if (!isNextCalled) {
          return;
        }
      }
      res.writeHead(404, 'Not Found');
      res.end();
    })
    .listen(port, () => {
      console.log(`Dev Server: https://localhost:${port}/`);
    });
})();
