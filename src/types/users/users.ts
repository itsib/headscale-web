export interface User {
  id: string;
  name: string;
  email: string;
  displayName?: string;
  profilePicUrl?: string;
  createdAt: string;
  provider: '' | 'oidc';
  providerId: string;
}
