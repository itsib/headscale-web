import { QueryFunctionContext, QueryKey } from '@tanstack/react-query';
import { Storage } from '@app-utils/storage';
import { ConnectionError, HttpError, UnauthorizedError } from './errors';
import { TokenType } from '../types';
import { joinUrl } from './join-url';

function getStatusText(code: number): string {
  switch (code) {
    case 400: return 'error_bad_request';
    case 401: return 'error_unauthorized';
    case 403: return 'error_forbidden';
    case 404: return 'error_not_found';
    case 500: return 'error_internal_server_error'
    default: return 'error_unknown';
  }
}

async function resolveFailureRes(res: Response): Promise<never> {
  let errorMessage = (await res.text());
  const statusText = res.statusText || getStatusText(res.status);
  if (!errorMessage) {
    throw new HttpError(statusText, res.status, errorMessage || statusText);
  }

  try {
    const error = JSON.parse(errorMessage);
    errorMessage = error.message;
  } catch { /* empty */ }

  if (errorMessage === 'Unauthorized') {
    throw new UnauthorizedError();
  }
  throw new HttpError(statusText, res.status, errorMessage || statusText);
}

export async function fetchFn<T = unknown>(url: string, init: RequestInit = {}, token?: string, tokenType?: TokenType): Promise<T> {
  const headers: Record<string, string> = (init.headers || {}) as Record<string, string>;
  const storage = Storage.get();
  token = token || storage.getItem<string>('main-token');
  tokenType = tokenType || storage.getItem<TokenType>('main-token-type');

  if (!/^http/.test(url)) {
    const base = storage.getItem<string>('main-url');
    if (base) {
      url = joinUrl(base, url);
    }
  }

  if (token && (tokenType === 'Bearer')) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && tokenType === 'apiKey') {
    const [baseUrl, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);
    params.set('token', token);
    url = `${baseUrl}?${params.toString()}`;
  }

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers: headers });
  } catch {
    throw new ConnectionError();
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedError();
    } else {
      await resolveFailureRes(res);
    }
  }

  const raw = (await res.text()) as string;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as T;
  }
}

export async function defaultQueryFn<T = unknown, TQueryKey extends QueryKey = QueryKey, TPageParam = never>(context: QueryFunctionContext<TQueryKey, TPageParam>): Promise<T> {
  const { queryKey, signal } = context;
  const url = queryKey[0] as string;
  const method = (queryKey[1] as string) || 'GET';

  return await fetchFn(url, { method, signal });
}
