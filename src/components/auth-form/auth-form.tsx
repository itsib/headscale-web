import { Input } from 'react-just-ui/input';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Device, ICredentials } from '@app-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinUrl } from '@app-utils/join-url';
import { fetchFn } from '@app-utils/query-fn';
import { AuthState } from '@app-utils/auth-state';
import './auth-form.css';

export interface AuthFormProps {
  onSuccess: (fields: ICredentials) => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn(fields: ICredentials) {
      const url = joinUrl(fields.base, '/api/v1/node');

      return fetchFn<{ nodes: Device[] }>(url, { method: 'GET' }, fields.token, fields.tokenType);
    },
    onSuccess(data, fields) {
      queryClient.setQueryData(['/api/v1/node', 'GET'], data);
      onSuccess(fields);
    },
    onError(error: any) {
      if (error.code === 401) {
        setError('token', { message: t('error_invalid_token') });
      } else if (error.code === -1) {
        setError('base', { message: t('error_connection_error') });
      } else {
        setError('base', { message: t('error_invalid_response') });
      }
    },
  });

  const { handleSubmit, register, formState, setError } = useForm<ICredentials>({
    defaultValues: async () => {
      const { base, tokenType, token } = AuthState.getPartial();
      return {
        base: base || '',
        token: token || '',
        tokenType: tokenType || 'Bearer',
      };
    },
    shouldUseNativeValidation: false,
    mode: 'onChange',
  });
  const { errors } = formState;

  function onSubmit(fields: ICredentials) {
    mutate(fields);
  }

  return (
    <form className="card auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mb-4">{t('credentials_form_header_new')}</h2>

      <div className="mb-4">
        <Input
          id="base-url-input"
          type="url"
          placeholder="https://"
          label={t('server_instance_url')}
          error={errors?.base}
          markRequired
          {...register('base', {
            required: true,
          })}
        />
      </div>

      <div className="mb-4">
        <Input
          id="token-input"
          label={t('headscale_api_key')}
          error={errors?.token}
          markRequired
          {...register('token', {
            required: true,
          })}
        />
      </div>

      <div className="mt-4">
        <button type="submit" className="btn btn-accent w-full" data-loading={isPending}>
          <span>{t('save')}</span>
        </button>
      </div>
    </form>
  );
}
