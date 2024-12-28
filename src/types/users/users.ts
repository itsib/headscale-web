export interface UserIdentity {
  name: string;
  displayName: string;
  email: string;
}

export interface User extends UserIdentity {
  id: string;
  profilePicUrl?: string;
  createdAt: string;
}

export interface UserWithProvider extends User {
  provider: 'oidc' | '';
  providerId: string;
}