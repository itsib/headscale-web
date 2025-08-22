import { useState } from 'preact/hooks';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchFn } from '@app-utils/query-fn';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { BtnCopy } from '@app-components/btn-copy/btn-copy';
import { FunctionComponent } from 'preact';
import { ModalHeader } from '@app-components/modals/modal-header.tsx';
import './modal-api-token-create.css';

export const ModalApiTokenCreate: FunctionComponent<ModalProps> = ({
  isOpen,
  onDismiss,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent onDismiss={onDismiss} {...props} />
    </Modal>
  );
};

const ModalContent: FunctionComponent<Omit<ModalProps, 'isOpen'>> = ({ onDismiss }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [newApiToken, setNewApiToken] = useState<string | undefined>();
  const [newApiTokenExpiry, setNewApiTokenExpiry] = useState<string | undefined>();

  const { handleSubmit, register, formState } = useForm<{ expiration: number }>({
    mode: 'onChange',
    defaultValues: {
      expiration: 90,
    },
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: { expiration: string }) {
      return await fetchFn<{ apiKey: string }>(`/api/v1/apikey`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
    },
    onSuccess: async (result, values) => {
      setNewApiToken(result.apiKey);
      setNewApiTokenExpiry(values.expiration);
      await queryClient.invalidateQueries({ queryKey: ['/api/v1/apikey', 'GET'] });
    },
  });

  function onSubmit(values: { expiration: number }) {
    const expiration = new Date(Date.now() + values.expiration * 24 * 60 * 60 * 1000);
    mutate({
      expiration: expiration.toISOString(),
    });
  }

  function onDone() {
    onDismiss?.();

    setTimeout(() => {
      setNewApiToken(undefined);
      setNewApiTokenExpiry(undefined);
    }, 300);
  }

  return (
    <div className="modal modal-md modal-api-token-create">
      <ModalHeader caption={newApiToken ? 'generated_new_api_token' : 'create_api_token_modal_title'} onDismiss={onDismiss} />
      <div className="modal-content">
        {newApiToken ? (
          <div>
            <div className="text-secondary text-sm font-normal">
              <Trans i18nKey="api_token_token_created_about_copy" />
            </div>

            <div className="new-token">
              <input className="" readOnly value={newApiToken} />

              <BtnCopy className="p-0 ml-4" text={newApiToken} />
            </div>

            <div className="text-secondary text-sm font-normal">
              <Trans
                i18nKey="api_token_token_created_about_expiry"
                components={{
                  date: <FormattedDate date={newApiTokenExpiry} />,
                }}
              />
            </div>

            <button type="button" className="btn btn-accent w-full mt-6" onClick={onDone}>
              <span>{t('done')}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <Input
                id="key-expiration"
                type="number"
                label={
                  <>
                    <div className="text-base font-semibold">{t('expiration')}</div>
                    <div className="text-secondary text-xs">{t('expiration_hint')}</div>
                  </>
                }
                suffix={t('days')}
                error={errors?.expiration}
                {...register('expiration', {
                  required: t('error_required'),
                  min: {
                    value: 1,
                    message: t('error_expiry_min', { value: 1 }),
                  },
                  max: {
                    value: 90,
                    message: t('error_expiry_max', { value: 90 }),
                  },
                })}
              />
            </div>

            <div>
              <button type="submit" className="btn btn-accent w-full" data-loading={isPending}>
                <span>{t('create')}</span>
              </button>
              {error ? (
                <div className="error-message">
                  {t(error.message)}
                </div>
              ) : null}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
