export interface ApiKeys {
  id: string;
  prefix: string;
  lastSeen?: string | null;
  createdAt: string;
  expiration: string;
}