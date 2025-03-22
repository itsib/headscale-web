import { FunctionComponent } from 'preact';
import { Input } from 'react-just-ui/input';
// import { url as urlValidator } from 'react-just-ui/validators';
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
  base?: string;
  submit: (fields: FormFields) => Promise<void>;
}

export const AuthForm: FunctionComponent<AuthFormProps> = ({ base, submit }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { handleSubmit, register, formState, setError } = useForm<FormFields>({
    defaultValues: {
      base: base || '',
      token: '',
      tokenType: 'Bearer',
    },
    shouldUseNativeValidation: false,
    mode: 'onChange',
  });
  const { errors } = formState;

  function onSubmit(fields: FormFields) {
    setErrorMessage(null);
    setLoading(true);
    submit(fields)
      .then(() => {

      })
      .catch(error => {
        setErrorMessage(typeof error === 'string' ? error : error.message);
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
          type="url"
          placeholder="https://"
          label={t('server_instance_url')}
          error={errors?.base}
          markRequired
          {...register('base')}
        />
      </div>

      <div className="mb-2">
        <Input
          id="token-input-home"
          label={t('headscale_api_key')}
          error={errors?.token}
          markRequired
          onInput={function onInput(event) {
            console.log((event.target as HTMLInputElement).value);
          }}
          {...register('token')}
        />
      </div>

      <div className="min-h-[14px] text-error">
        {errorMessage}
      </div>

      <div className="mt-4">
        <button type="submit" className="btn btn-accent w-full" data-loading={loading}>
          <span>{t('save')}</span>
        </button>
      </div>
    </form>
  );
};