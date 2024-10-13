import { useContext } from 'react';
import ApplicationContext from '../context/application/application.context.ts';

export function useLogin() {
  const { login } = useContext(ApplicationContext);
  return login;
}