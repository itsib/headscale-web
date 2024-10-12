import { User } from '../users/users.ts';

export interface AuthKey {
  id: string;
  user: string;
  key: string;
  aclTags: string[];
  reusable: boolean;
  ephemeral: boolean;
  used: boolean;
  createdAt: string;
  expiration: string;
}

export interface AuthKeyWithUser extends Omit<AuthKey, 'user'> {
  user: User;
}