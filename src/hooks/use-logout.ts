import ApplicationContext from '../context/application/application.context.ts';
import { useContext } from 'react';

export function useLogout() {
  const { logout } = useContext(ApplicationContext);
  return logout;
}