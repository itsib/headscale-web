import { QueryFunctionContext, QueryKey } from '@tanstack/react-query';
import { ConnectionError, HttpError, UnauthorizedError } from './errors';

async function resolveFailureRes(res: Response): Promise<never> {
  let errorMessage = (await res.text());
  try {
    const error = JSON.parse(errorMessage);
    errorMessage = error.message;
  } catch { /* empty */ }

  if (errorMessage === 'Unauthorized') {
    throw new UnauthorizedError();
  }
  throw new HttpError(res.statusText, res.status, errorMessage || res.statusText);
}

export function normalizeUrl(base: string, path: string): string {
  if (base.endsWith('/') && path.startsWith('/')) {
    path = path.slice(1);
  }
  return base + path;
}

export async function fetchFn<T = unknown>(url: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (token) {
    headers.set('Authorization', 'Bearer ' + token);
  }
  if (!headers.has('content-type')) {
    headers.set('Content-Type', 'application/json');
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: headers,
    });
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
  let url = queryKey[0] as string;
  const method = (queryKey[1] as string) || 'GET';
  const token = localStorage.getItem('headscale.token') || undefined;

  if (!url.startsWith('http')) {
    const base = localStorage.getItem('headscale.url');
    if (base) {
      url = `${base}${url}`;
    }
  }

  return await fetchFn(url, { method, signal }, token);
}

export async function signedQueryFn<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('headscale.token') || undefined;
  const base = localStorage.getItem('headscale.url');

  if (!base || !token) {
    throw new UnauthorizedError();
  }

  const url = normalizeUrl(base, path)

  return await fetchFn<T>(url, init, token);
}