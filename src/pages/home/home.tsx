import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Input, url } from 'react-just-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors.ts';
import { ApiKeys } from '../../types';

interface FormValues {
  url: string;
  token: string;
}

export const HomePage: FC = () =>  {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { handleSubmit, register, formState } = useForm<FormValues>({
    defaultValues: {
      url: localStorage.getItem('headscale.token') || '',
      token: localStorage.getItem('headscale.url') || '',
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
      return  (await res.json()) as { apiKeys: ApiKeys[] };
    },
    onSuccess(_, values) {
      localStorage.setItem('headscale.token', values.token);
      localStorage.setItem('headscale.url', values.url);
      navigate('/machines');
    }
  });

  return (
    <div className="container">
      <div className="w-full h-[80vh] min-h-[max(80vh, 700px)] flex items-start justify-center">

        <form className="card w-[520px] mt-[16vh] mb-[200px]" onSubmit={handleSubmit(mutate as any)}>
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

          <Input id="token-input" label={t('headscale_api_key')} error={errors?.token} {...register('token', { required: t('error_required') })} />

          {isPending ? (
            <button type="button" className="btn-primary w-full" disabled>
              <div className="jj jj-spinner" />
            </button>
          ) : (
            <button type="submit" className="btn-primary w-full">
              <span>{t('save')}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}