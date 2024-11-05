import { FC, useState } from 'react';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input, url } from 'react-just-ui';
import { Credentials } from '../../../types';

export interface ModalAuthorizationProps extends ModalProps {
  baseUrl?: string;
  token?: string;
  metricsUrl?: string;
  onSubmit: (credentials: Required<Credentials>) => Promise<any>;
}

export const ModalAuthorization: FC<ModalAuthorizationProps> = ({ isOpen, onDismiss, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent {...props} />
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalAuthorizationProps, 'isOpen' | 'onDismiss'>> = ({ onSubmit, baseUrl, metricsUrl, token }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState, setError } = useForm<Required<Credentials>>({
    defaultValues: {
      baseUrl,
      metricsUrl,
      token,
    },
    shouldUseNativeValidation: false,
  });
  const { errors, isValid } = formState;

  async function onSubmitCallback(credentials: Required<Credentials>) {
    setIsLoading(true);

    try {
      const result = await onSubmit(credentials);
      if (result) {
        return;
      }
    } catch (error: any) {
      if (error.code === 401) {
        setError('token', { message: t('error_invalid_token') });
      } else if (error.code === -1) {
        setError('baseUrl', { message: t('error_connection_error') });
      } else {
        setError('baseUrl', { message: t('error_invalid_response') });
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="modal w-[400px]">
      <div className="modal-header">
        <div className="title">
          {token ? (
            <span>{t('credentials_form_header_expired')}</span>
          ) : (
            <span>{t('credentials_form_header_new')}</span>
          )}
        </div>
      </div>
      <div className="modal-content">
        <form className="" onSubmit={handleSubmit(onSubmitCallback)}>
          <div className="mb-2">
            <Input
              id="base-url-input"
              placeholder="https://"
              label={t('server_instance_url')}
              error={errors?.baseUrl}
              markRequired
              {...register('baseUrl', {
                required: t('error_required'),
                validate: url(t('error_invalid_url')),
              })}
            />
          </div>

          <div className="mb-2">
            <Input
              id="token-input"
              label={t('headscale_api_key')}
              error={errors?.token}
              markRequired
              {...register('token', {
                required: t('error_required'),
              })}
            />
          </div>

          <div className="mb-2">
            <Input
              id="metric-url-input"
              placeholder="https://"
              label={t('url_to_get_metrics')}
              error={errors?.metricsUrl}
              {...register('metricsUrl', {
                validate: url(t('error_invalid_url')),
              })}
            />
          </div>

          <div className="mt-4">
            <button type="submit" disabled={!isValid} className={`btn btn-accent w-full ${isLoading ? 'loading' : ''}`}>
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};