import { base64url, SignJWT, jwtVerify } from 'jose';

(async () => {
  const alg = process.env.JWT_SIGN_ALGORITHM; // 'HS256';
  const username = process.env.JWT_USERNAME;
  const secret = base64url.decode(process.env.JWT_SECRET);

  const jwt = await new SignJWT({ username })
    .setProtectedHeader({ alg, typ: 'JWK' })
    .setIssuedAt()
    .setIssuer('https://itsib.su')
    .setAudience(['https://am.itsib.su/metrics'])
    .setExpirationTime('30d')
    .sign(secret);

  const result = await jwtVerify(jwt, secret)

  console.log('\x1b[0;93mGenerate JWT token\x1b[0m');
  console.log(jwt);
  console.log('\x1b[0;93mJWT verified\x1b[0m');

  console.table({
    ...result.payload,
    aud: Array.isArray(result.payload.aud) ? result.payload.aud.join('\n') : result.payload.aud,
  });
})();