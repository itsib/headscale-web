import { base64url } from 'jose';
import { randomBytes } from 'crypto';


(async () => {
  const key32Bytes = randomBytes(32);
  const base64Key = base64url.encode(key32Bytes);

  console.log('\x1b[0;93mGenerate JWK secret\x1b[0m');
  console.log('\n\x1b[0;37m32 bytes represent as base64url:\x1b[0m');
  console.log(base64Key);
  console.log('\n\x1b[0;37mbase64url represent as base64:\x1b[0m');
  console.log(btoa(base64Key));
})()