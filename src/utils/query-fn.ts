import { QueryFunctionContext, QueryKey } from '@tanstack/react-query';
import { HttpError, UnauthorizedError } from './errors';
import { QueryError } from '../types';

export async function fetchFn<T = unknown>(url: string, init: RequestInit & { accessToken?: string } = {}): Promise<T> {
  const accessToken = init.accessToken || localStorage.getItem('headscale.token');
  const base = localStorage.getItem('headscale.url');
  Reflect.deleteProperty(init, 'accessToken');

  const res = await fetch(`${base}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: 'Bearer ' + accessToken } : {}),
      ...(init.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedError();
    } else {
      const error = (await res.json()) as QueryError;
      throw new HttpError(res.statusText, res.status, error.message || res.statusText);
    }
  }

  return (await res.json()) as Promise<T>;
}

export async function defaultQueryFn<T = unknown, TQueryKey extends QueryKey = QueryKey, TPageParam = never>(context: QueryFunctionContext<TQueryKey, TPageParam>): Promise<T> {
  const { queryKey, signal, meta } = context;
  const url = queryKey[0] as string;
  const method = (queryKey[1] as string) || 'GET';

  return await fetchFn(url, { method, signal, accessToken: meta?.accessToken as string });
}
