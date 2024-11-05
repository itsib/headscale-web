import { useContext } from 'react';
import { Credentials } from '../types';
import { AuthContext } from '../context/auth/auth.context.ts';

export function useAppCredentials(): Partial<Credentials> {
  const { baseUrl, metricsUrl, token } = useContext(AuthContext);
  return { baseUrl, metricsUrl, token };
}