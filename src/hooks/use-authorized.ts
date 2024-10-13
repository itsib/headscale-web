import { useContext } from 'react';
import ApplicationContext from '../context/application/application.context.ts';

export function useAuthorized(): boolean {
  const { authorized } = useContext(ApplicationContext);
  return authorized;
}