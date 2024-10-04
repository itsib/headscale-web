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
