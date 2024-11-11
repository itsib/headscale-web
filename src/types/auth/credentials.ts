
export type TokenType = 'Bearer' | 'apiKey';

export interface Credentials {
  url: string;
  token: string;
  tokenType: TokenType;
}