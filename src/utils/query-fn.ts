import { QueryKey, QueryFunctionContext } from '@tanstack/react-query';
import { HttpError, UnauthorizedError, ValidationError } from './errors';
import { QueryError } from '../types';

export async function fetchFn<T = unknown>(url: string, init: RequestInit & { accessToken?: string } = {}): Promise<T> {
  const accessToken = init.accessToken || sessionStorage.getItem('accessToken');
  Reflect.deleteProperty(init, 'accessToken');

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: 'Bearer ' + accessToken } : {}),
      ...(init.headers || {}),
    },
    mode: 'same-origin',
    ...init,
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedError();
    } else if (res.status === 400) {
      const error = (await res.json()) as QueryError;
      if (Array.isArray(error.errors)) {
        throw new ValidationError(error.errors, error.message);
      }

      throw new HttpError(error.message || res.statusText, res.status);
    }
    throw new HttpError(res.statusText, res.status);
  }

  return (await res.json()) as Promise<T>;
}

export async function defaultQueryFn<T = unknown, TQueryKey extends QueryKey = QueryKey, TPageParam = never>(context: QueryFunctionContext<TQueryKey, TPageParam>): Promise<T> {
  const { queryKey, signal, meta } = context;
  const url = queryKey[0] as string;
  const method = (queryKey[1] as string) || 'GET';

  return await fetchFn(url, { method, signal, accessToken: meta?.accessToken as string });
}
