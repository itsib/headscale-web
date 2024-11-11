import { Credentials } from '../types';

const DEFAULT_CREDENTIALS: Partial<Credentials> = { url: undefined, token: undefined };

function getStoreKey(key: 'auth' | 'metrics') {
  switch (key) {
    case 'auth':
      return 'headscale.credentials';
    case 'metrics':
      return 'headscale.metrics';
    default:
      throw new Error('Unsupported key');
  }
}

export function getStoredCredentials(key: 'auth' | 'metrics' = 'auth'): Partial<Credentials> {
  const credentialsJson = localStorage.getItem(getStoreKey(key));
  if (!credentialsJson) {
    return DEFAULT_CREDENTIALS;
  }

  try {
    const credentials = JSON.parse(credentialsJson) as Partial<Credentials>;
    if (credentials && typeof credentials === 'object') {
      return credentials;
    }
  } catch (error: any) {
    console.error(error);
    localStorage.removeItem(getStoreKey(key));
  }
  return DEFAULT_CREDENTIALS;
}

export function setStoredCredentials(credentials: Partial<Credentials>, key: 'auth' | 'metrics' = 'auth'): void {
  localStorage.setItem(getStoreKey(key), JSON.stringify(credentials));
}

export function removeTokenCredentials(key: 'auth' | 'metrics' = 'auth'): void {
  const credentials = getStoredCredentials(key);
  credentials.token = '';
  setStoredCredentials(credentials, key);
}