export interface ApiToken {
  id: string;
  prefix: string;
  lastSeen?: string | null;
  createdAt: string;
  expiration: string;
}