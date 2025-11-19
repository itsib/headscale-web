import { createContext } from 'react';

export interface IAuthContext {
  prefix?: string;
  base?: string;
  isAuthorized: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  isAuthorized: false,
  logout: () => Promise.reject(new Error('NOT_IMPLEMENTED')),
});
