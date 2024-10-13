import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Input, url } from 'react-just-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors.ts';
import { AuthKey } from '../../types';
import { useLogin } from '../../hooks/use-login.ts';

interface FormValues {
  url: string;
  token: string;
}

export const HomePage: FC = () =>  {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();

  const { handleSubmit, register, formState } = useForm<FormValues>({
    defaultValues: {
      url: localStorage.getItem('headscale.url') || '',
      token: localStorage.getItem('headscale.token') || '',
    }
  });
  const { errors } = formState;

  const { mutate, isPending } = useMutation({
    async mutationFn(values: FormValues) {
      const res = await fetch(values.url + '/api/v1/apikey', {
        headers: {
          Authorization: 'Bearer ' + values.token,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        throw new HttpError(res.statusText, res.status);
      }
      return  (await res.json()) as { apiKeys: AuthKey[] };
    },
    onSuccess(_, values) {
      login(values);
      navigate('/machines');
    }
  });

  return (
    <div className="container">
      <div className="w-full h-[80vh] min-h-[max(80vh, 700px)] flex items-start justify-center">

        <form className="card w-[460px] mt-[16vh] mb-[200px]" onSubmit={handleSubmit(mutate as any)}>
          <h3 className="mb-4 font-bold">{t('credentials_form_header')}</h3>

          <Input
            id="url-input"
            placeholder="https://"
            label={t('instance_url')}
            error={errors?.url}
            {...register('url', {
              required: t('error_required'),
              validate: url(t('error_invalid_url')),
            })
            } />

          <Input id="token-input" label={t('headscale_api_key')}
                 error={errors?.token} {...register('token', { required: t('error_required') })} />

          <div className="mt-4">
            <button type="submit" className={`btn btn-accent w-full ${isPending ? 'loading' : ''}`}>
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}