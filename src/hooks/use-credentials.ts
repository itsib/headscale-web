import { useContext, useEffect, useState } from 'react';
import { ApplicationContext } from '@app-context/application';
import { Credentials, QueryResult } from '@app-types';
import { getCredentials } from '@app-utils/credentials.ts';

export function useCredentials(): QueryResult<Credentials> {
  const [data, setData] = useState<Credentials>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { storage, isAuthorized } = useContext(ApplicationContext);

  useEffect(() => {
    setError(null);
    setIsLoading(true);
    let canceled = false;

    async function run() {
      try {
        const credentials = await getCredentials(storage);
        if (canceled) return;

        setIsLoading(false);
        setData(credentials);
      } catch (e) {
        if (canceled) return;
        setIsLoading(false);
        setError(e as Error);
      }
    }

    run();

    return () => {
      canceled = true;
    }
  }, [storage, isAuthorized]);

  return { data, isLoading, error }
}