import { useContext } from 'react';
import { ApplicationContext } from '@app-context/application';

export function useStorage() {
  const { storage } = useContext(ApplicationContext);
  return storage;
}