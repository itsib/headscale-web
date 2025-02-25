import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui/input';
import { cn } from 'react-just-ui/utils/cn';
import { url as urlValidator } from 'react-just-ui/validators';
import { useContext, useState } from 'preact/hooks';
import { Credentials } from '@app-types';
import { setCredentials } from '@app-utils/credentials';
import { ApplicationContext } from '@app-context/application';
import { fetchFn } from '@app-utils/query-fn';
import { joinUrl } from '@app-utils/join-url';
import { useLocation } from 'preact-iso/router';
import { useCredentials } from '@app-hooks/use-credentials.ts';

export function Home() {
  const { t } = useTranslation();
  const { route } = useLocation();
  const { data: credentials } = useCredentials();
  const { base, token, tokenType } = credentials || {};
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
      route('/nodes');
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
            <button type="submit" className={cn('btn btn-accent w-full', { loading: isLoading })}>
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
