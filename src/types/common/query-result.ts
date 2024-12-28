export interface QueryResult<TData, TError extends Error = Error> {
  isLoading: boolean;
  error?: TError | null;
  data?: TData;
}
