import { QueryFieldError } from '../types/common/query-error';


export class HttpError extends Error {
  name = 'HttpError';
  readonly code: number;
  readonly message: string;

  constructor(status: string, code: number, message = 'unknown_error') {
    super(status);

    this.code = code;
    this.message = message;
  }
}

export class UnauthorizedError extends HttpError {
  name = 'UnauthorizedError';

  constructor(message = 'authorisation_fault') {
    super('UNAUTHORIZED', 401, message);
  }
}

export class ValidationError extends HttpError {
  name = 'ValidationError';
  fields: QueryFieldError[];

  constructor(fields: QueryFieldError[], message = 'Validation error') {
    super('BAD_REQUEST', 400, message);

    this.fields = fields;
  }
}

export function errorHandler(setError: (field: string, data: { message: string }, opts?: any) => void, error: Error) {
  if (error instanceof ValidationError) {
    for (let i = 0; i < error.fields.length; i++) {
      const fieldError = error.fields[i];

      setError(fieldError.field as any, { message: fieldError.constraints[0] }, { shouldFocus: true });
    }
  } else {
    setError('root', { message: error.message });
  }
}
