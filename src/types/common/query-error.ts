export interface QueryFieldError {
  field: string;
  value: any;
  constraints: string[];
}

export interface QueryError {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  errors: QueryFieldError[];
}
