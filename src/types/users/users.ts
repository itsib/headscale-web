export interface User {
  id: string;
  displayName?: string;
  name?: string;
  email: string;
  profilePicUrl?: string;
  createdAt: string;
}

export interface UserWithProvider extends User {
  provider: 'oidc'
  providerId: string;
}