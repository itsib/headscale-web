import { createContext } from 'react';
import { Credentials } from '../../types';
import { getStoredCredentials } from '../../utils/local-storage.ts';

export interface IAuthContext extends Partial<Credentials> {
  authenticated: boolean;
  credentials: Partial<Credentials>;
  signIn: (credentials: Credentials) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  authenticated: false,
  credentials: getStoredCredentials(),
  signIn: () => Promise.reject(new Error('NOT_IMPLEMENTED')),
  logout: () => new Error('NOT_IMPLEMENTED'),
})