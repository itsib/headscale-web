export interface QueryResult<TData, TError extends Error = Error> {
  isLoading: boolean;
  error?: TError | null;
  data?: TData;
}

export interface QueryResultPaginatedMeta {
  totalItems: number;
  items: number;
  totalPages: number;
  page: number;
}

export interface QueryResultPaginatedList<TData, TError extends Error = Error> {
  isLoading: boolean;
  error?: TError | null;
  items?: TData[];
  meta?: QueryResultPaginatedMeta;
}
