import { KeyObject } from 'node:crypto';
import { base64url } from 'jose';
const { subtle } = globalThis.crypto;

(async () => {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);
  const keyObject = KeyObject.from(key);
  const jwk = keyObject.export({ format: 'jwk' });
  const signKey = base64url.encode(key.k);

  console.log('\x1b[0;93mGenerate JWK secret\x1b[0m');
  console.log('%sAlgorithm:%s'.padEnd(16, ' ') + ' %s', '\x1b[0;37m', '\x1b[0m', 'HMAC', 'SHA-256');
  console.log('%sSign Key:%s'.padEnd(16, ' ') + ' %s', '\x1b[0;37m', '\x1b[0m', signKey);
  console.log('%sSign Key:%s'.padEnd(16, ' ') + ' %s', '\x1b[0;37m', '\x1b[0m', jwk);
})()