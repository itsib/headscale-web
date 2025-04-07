
export type TokenType = 'Bearer' | 'apiKey';

export interface ICredentials {
  base: string;
  token: string;
  tokenType: TokenType;
}