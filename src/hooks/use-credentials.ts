import { useContext } from 'react';
import { AuthContext } from '@app-context/auth';

export function useCredentials(): {
  isAuthorized: boolean;
  logout: () => Promise<void>;
  prefix?: string;
  base?: string;
} {
  const { isAuthorized, logout, prefix, base } = useContext(AuthContext);

  return { isAuthorized, logout, prefix, base };
}
