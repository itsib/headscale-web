import { QueryFunctionContext, QueryKey } from '@tanstack/react-query';
import { StorageAsync } from '@app-utils/storage';
import { ConnectionError, HttpError, UnauthorizedError } from './errors';
import { TokenType } from '../types';
import { getCredentials } from './credentials.ts';
import { joinUrl } from './join-url.ts';

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
    return Promise.reject(new ConnectionError());
  }

  if (!res.ok) {
    if (res.status === 401) {
      return Promise.reject(new UnauthorizedError());
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

export async function fetchWithContext<T = unknown>(url: string, init: RequestInit = {}, storage: StorageAsync): Promise<T> {
  const { base, token, tokenType } = await getCredentials(storage);
  return await fetchFn(joinUrl(base, url), init, token, tokenType);
}

export function getDefaultQueryFn(storage: StorageAsync) {
  return async function defaultQueryFn<T = unknown, TQueryKey extends QueryKey = QueryKey, TPageParam = never>(context: QueryFunctionContext<TQueryKey, TPageParam>): Promise<T> {
    const { queryKey, signal } = context;
    let url = queryKey[0] as string;
    const method = (queryKey[1] as string) || 'GET';

    const { base, token, tokenType } = await getCredentials(storage);

    if (!url.startsWith('http') && base) {
      url = `${base}${url}`;
    }

    try {
      return await fetchFn(url, { method, signal }, token, tokenType);
    } catch (error: any) {
      if (error.code === 401) {
        await storage.removeItem('main-token');
      }
      throw error;
    }
  }
}
