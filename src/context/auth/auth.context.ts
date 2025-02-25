import { createContext } from 'preact';

export interface IAuthContext {
  isAuthorized: boolean;
  prefix?: string;
  base?: string;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  isAuthorized: false,
  logout: () => Promise.reject(new Error('NOT_IMPLEMENTED')),
});