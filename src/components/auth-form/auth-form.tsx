import { FunctionComponent } from 'preact';
import { Input } from 'react-just-ui/input';
import { url as urlValidator } from 'react-just-ui/validators';
import { cn } from 'react-just-ui/utils/cn';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { TokenType } from '@app-types';
import { useState } from 'preact/hooks';

interface FormFields {
  base: string;
  token: string;
  tokenType: TokenType;
}

export interface AuthFormProps {
  submit: (fields: FormFields) => Promise<void>;
}

export const AuthForm: FunctionComponent<AuthFormProps> = ({ submit }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const { handleSubmit, register, formState, setError, reset } = useForm<FormFields>({
    defaultValues: {
      base: '',
      token: '',
      tokenType: 'Bearer',
    }
  });
  const { errors } = formState;

  function onSubmit(fields: FormFields) {
    setLoading(true);
    submit(fields)
      .then(() => {
        setLoading(true);
        reset();
      })
      .catch(error => {
        if (error.code === 401) {
          setError('token', { message: t('error_invalid_token') });
        } else if (error.code === -1) {
          setError('base', { message: t('error_connection_error') });
        } else {
          setError('base', { message: t('error_invalid_response') });
        }
        setLoading(false);
      })
  }

  return (
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
        <button type="submit" className={cn('btn btn-accent w-full', { loading })}>
          <span>{t('save')}</span>
        </button>
      </div>
    </form>
  );
};