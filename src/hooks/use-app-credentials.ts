import { useContext } from 'react';
import { Credentials } from '../types';
import { AuthContext } from '../context/auth/auth.context.ts';

export function useAppCredentials(): Partial<Credentials> {
  const { credentials } = useContext(AuthContext);
  return { url: credentials?.url, token: credentials?.token };
}