export type NotifyStatus = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface Notify {
  status?: NotifyStatus;
  title?: string;
  description?: string;
  timeout?: number | false;
}

export interface NotifyInstance extends Notify {
  id: string;
  closed: boolean;
  createdAt: number;
  update: (notify: Partial<Notify>) => void;
  close: () => void;
  remove: () => void;
}