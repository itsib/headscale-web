import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, url as urlValidator } from 'react-just-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Credentials } from '../../types';
import { useAppAuth } from '../../hooks/use-app-auth.ts';
import { useAppCredentials } from '../../hooks/use-app-credentials.ts';

export const HomePage: FC = () =>  {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { url, token, tokenType } = useAppCredentials();
  const [isLoading, setIsLoading] = useState(false);
  const [, signIn] = useAppAuth();

  const { handleSubmit, register, formState, setError } = useForm<Credentials>({
    defaultValues: {
      url: url || import.meta.env.VITE_ACCESS_URL || '',
      token: token || import.meta.env.VITE_ACCESS_TOKEN || '',
      tokenType: tokenType || 'Bearer',
    }
  });
  const { errors } = formState;

  async function onSubmit(values: Credentials) {
    setIsLoading(true)

    try {
      await signIn(values);
      setIsLoading(false);
      navigate('/machines');
    } catch (error: any) {
      if (error.code === 401) {
        setError('token', { message: t('error_invalid_token') });
      } else if (error.code === -1) {
        setError('url', { message: t('error_connection_error') });
      } else {
        setError('url', { message: t('error_invalid_response') });
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
              error={errors?.url}
              markRequired
              {...register('url', {
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