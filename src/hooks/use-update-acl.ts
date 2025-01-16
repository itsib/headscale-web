import { useMutation } from '@tanstack/react-query';
import { fetchWithContext } from '../utils/query-fn.ts';
import { AclPolicy } from '../types';
import { useContext } from 'react';
import ApplicationContext from '../context/application/application.context.ts';
import { useRouter } from '@tanstack/react-router';

export function useUpdateAcl() {
  const { storage } = useContext(ApplicationContext);
  const { invalidate } = useRouter();

  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationKey: ['/api/v1/policy'],
    mutationFn(policy: string) {
      return fetchWithContext<AclPolicy>(
        '/api/v1/policy',
        {
          method: 'PUT',
          body: JSON.stringify({ policy }),
        },
        storage,
      );
    },
    onSuccess() {
      invalidate();
    },
  });

  return { mutate, mutateAsync, isPending, error, reset };
}