
export type TokenType = 'Bearer' | 'apiKey';

export interface Credentials {
  base: string;
  token: string;
  tokenType: TokenType;
}