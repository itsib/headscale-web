import { createContext } from 'react';
import { Notify, NotifyInstance } from '@app-types';

export interface INotifyContext {
  notify: (notify: Notify) => NotifyInstance;
}

export const NotifyContext = createContext<INotifyContext>({
  notify: () => {
    throw new Error('Notify not implemented');
  },
});
