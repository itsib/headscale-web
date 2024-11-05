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

export class ConnectionError extends HttpError {
  name = 'ConnectionError';

  constructor(message = 'err_connection_refused') {
    super('ERR_CONNECTION_REFUSED', -1, message);
  }
}

export function formatError(error: Error): string {
  const message = error.message || '';
  return `${message.charAt(0).toUpperCase()}${message.substring(1)}`;
}
