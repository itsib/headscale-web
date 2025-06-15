/**
 * If its based on usernames, or other identifiers not
 * containing an @, an @ should be appended at the end.
 * For example, if your user is john, it must be written as john@ in the policy.
 */
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
