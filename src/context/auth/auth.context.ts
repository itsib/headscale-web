import { createContext } from 'react';
import { Credentials } from '../../types';

export interface IAuthContext extends Partial<Credentials> {
  authenticated: boolean;
  signIn: (credentials: Credentials) => Promise<any>;
  logout: () => void;
  setMetricUrl: (metricsUrl: string) => void;
}

export const AuthContext = createContext<IAuthContext>({
  authenticated: false,
  signIn: () => Promise.reject(new Error('NOT_IMPLEMENTED')),
  logout: () => new Error('NOT_IMPLEMENTED'),
  setMetricUrl: () => new Error('NOT_IMPLEMENTED'),
})