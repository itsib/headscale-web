import { FC } from 'react';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { Input, url, Textarea, Select } from 'react-just-ui';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { fetchFn } from '../../../utils/query-fn.ts';
import { HttpError } from '../../../utils/errors.ts';
import { Credentials } from '../../../types';
import { METRICS_TOKEN_TYPES } from '../../../config.ts';

export interface ModalMetricsUrlProps extends ModalProps {
  credentials: Partial<Credentials> | null;
  onSuccess?: (credentials: Required<Credentials>) => void;
}

export const ModalMetricsUrl: FC<ModalMetricsUrlProps> = ({ isOpen, onDismiss, credentials, onSuccess }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent onDismiss={onDismiss} credentials={credentials} onSuccess={onSuccess} />
    </Modal>
  );
}

const ModalContent: FC<Omit<ModalMetricsUrlProps, 'isOpen'>> = ({ onDismiss, credentials, onSuccess }) => {
  const { t } = useTranslation();
  const { handleSubmit, register, formState, setError, control } = useForm<Required<Credentials>>({
    defaultValues: {
      base: credentials?.base || '',
      token: credentials?.token || '',
      tokenType: credentials?.tokenType || 'Bearer',
    }
  });
  const tokenType = useWatch({ control, name: 'tokenType' });
  const { errors, isValid } = formState;


  const { mutate, isPending } = useMutation({
    mutationFn: async ({ base, token, tokenType }: Required<Credentials>) => {
      const result = await fetchFn(base, {
        headers: {
          'Content-Type': 'text/plain;utf-8'
        }
      }, token, tokenType);

      if (!result) {
        throw new HttpError('NOT_FOUND', 404, 'not')
      }
      return true;
    },
    onSuccess: (_, credentials: Required<Credentials>) => {
      onSuccess?.(credentials);
      onDismiss();
    },
    onError: (error: any) => {
      setError('base', { message: t(error.message || '') });
    }
  });

  return (
    <div className="modal w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('no_metric_page_header')}</span>
        </div>
        <button type="button" className="jj-btn btn-close" onClick={() => onDismiss()}/>
      </div>
      <div className="modal-content">
        <form className="" onSubmit={handleSubmit(values => mutate(values))}>
          <div className="mb-2">
            <Input
              id="metric-server-url"
              markRequired
              placeholder="https://example.com/metrics"
              label={t('metric_url_label')}
              error={errors?.base}
              {...register('base', {
                validate: url(t('error_invalid_url')),
              })}
            />
          </div>

          <div className="mb-2">
            <Select
              id="metric-token-type"
              label={t('metric_token_type')}
              options={METRICS_TOKEN_TYPES}
              error={errors?.tokenType}
              {...register('tokenType')}
            />
          </div>

          <div className="mb-2">
            <Textarea
              id="metric-access-token"
              className="w-[calc(100%-26px)]"
              placeholder={tokenType === 'Bearer' ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp....' : 'M2CfUFPaNA.CQAk7cErsC7...'}
              label={t('metric_token_label')}
              minHeight={80}
              error={errors?.token}
              {...register('token')}
            />
          </div>

          <div className="mt-4">
            <button type="submit" disabled={!isValid || isPending}
                    className={`jj-btn btn-accent w-full ${isPending ? 'loading' : ''}`}>
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}