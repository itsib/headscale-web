import { useContext } from 'react';
import { AuthContext } from '../context/auth/auth.context.ts';
import { Credentials } from '../types';

export function useAppAuth(): [boolean, (credentials: Credentials) => Promise<any>, () => void] {
  const { authenticated, signIn, logout } = useContext(AuthContext);
  return [authenticated, signIn, logout];
}