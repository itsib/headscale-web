import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input, url as urlValidator } from 'react-just-ui';
import { useContext, useState } from 'react';
import { Credentials } from '../../types';
import { getCredentials, setCredentials } from '../../utils/credentials.ts';
import ApplicationContext from '../../context/application/application.context.ts';
import { fetchFn } from '../../utils/query-fn.ts';
import { joinUrl } from '../../utils/join-url.ts';

export const Route = createFileRoute('/home/')({
  loader: async ({ context }): Promise<Credentials> => {
    if (!context.isAuthorized) {
      return {
        base: import.meta.env.VITE_ACCESS_URL || '',
        token: import.meta.env.VITE_ACCESS_TOKEN || '',
        tokenType: 'Bearer',
      };
    }
    try {
      return await getCredentials(context.storage)
    } catch {
      return {
        base: import.meta.env.VITE_ACCESS_URL || '',
        token: import.meta.env.VITE_ACCESS_TOKEN || '',
        tokenType: 'Bearer',
      };
    }
  },
  component: Component,
});

function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { base, token, tokenType } = Route.useLoaderData() as Credentials;
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthorized, storage } = useContext(ApplicationContext);

  const { handleSubmit, register, formState, setError } = useForm<Credentials>({
    defaultValues: { base, token, tokenType }
  });
  const { errors } = formState;

  async function onSubmit(values: Credentials) {
    setIsLoading(true);

    try {
      await fetchFn(joinUrl(values.base, '/api/v1/node'), { method: 'GET' }, values.token, values.tokenType);

      await setCredentials(storage, { ...values });
      setIsAuthorized(true);
      setIsLoading(false);
      navigate({ to: '/machines' });
    } catch (error: any) {
      if (error.code === 401) {
        setError('token', { message: t('error_invalid_token') });
      } else if (error.code === -1) {
        setError('base', { message: t('error_connection_error') });
      } else {
        setError('base', { message: t('error_invalid_response') });
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="w-full h-[80vh] min-h-[max(80vh, 700px)] flex items-start justify-center">

        <form className="card w-[460px] mt-[16vh] mb-[200px]" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="mb-4 font-bold">{t('credentials_form_header_new')}</h3>

          <div className="mb-2">
            <Input
              id="base-url-input-home"
              placeholder="https://"
              label={t('server_instance_url')}
              error={errors?.base}
              markRequired
              {...register('base', {
                required: t('error_required'),
                validate: urlValidator(t('error_invalid_url')),
              })}
            />
          </div>

          <div className="mb-2">
            <Input
              id="token-input-home"
              label={t('headscale_api_key')}
              error={errors?.token}
              markRequired
              {...register('token', {
                required: t('error_required'),
              })}
            />
          </div>

          <div className="mt-4">
            <button type="submit" className={`jj-btn btn-accent w-full ${isLoading ? 'loading' : ''}`}>
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
