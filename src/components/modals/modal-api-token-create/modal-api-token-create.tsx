import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { signedQueryFn } from '../../../utils/query-fn.ts';
import { FormattedDate } from '../../formatters/formatted-date.tsx';
import { BtnCopy } from '../../btn-copy/btn-copy.tsx';

interface FormFields {
  expiration: number;
}

export interface ModalApiTokenCreateProps extends ModalProps {
  onSuccess: () => void;
}

export const ModalApiTokenCreate: FC<ModalApiTokenCreateProps> = ({ isOpen, onDismiss, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent onDismiss={onDismiss} {...props} />
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalApiTokenCreateProps, 'isOpen'>> = ({ onDismiss, onSuccess }) => {
  const { t } = useTranslation();
  const [newApiToken, setNewApiToken] = useState<string | undefined>();
  const [newApiTokenExpiry, setNewApiTokenExpiry] = useState<string | undefined>();

  const { handleSubmit, register, formState } = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: {
      expiration: 90,
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: { expiration: string }) {
      return await signedQueryFn<{ apiKey: string }>(`/api/v1/apikey`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
    },
    onSuccess: (result, values) => {
      setNewApiToken(result.apiKey);
      setNewApiTokenExpiry(values.expiration);
    },
  });

  function onSubmit(values: FormFields) {
    const expiration = new Date(Date.now() + (values.expiration * 24 * 60 * 60 * 1000));
    mutate({
      expiration: expiration.toISOString(),
    })
  }

  return (
    <div className="modal w-[400px]">
      <div className="modal-header">
        <div className="title">
          {newApiToken ? (
            <span>{t('generated_new_api_token')}</span>
          ) : (
            <span>{t('create_api_token_modal_title')}</span>
          )}
        </div>
        <button type="button" className="jj-btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        {newApiToken ? (
          <div>
            <div className="text-secondary text-sm font-normal">
              <Trans i18nKey="api_token_token_created_about_copy"/>
            </div>

            <div className="border-secondary border rounded-md px-3 py-2 my-4 flex">
              <input className="w-full outline-none" readOnly value={newApiToken}/>

              <BtnCopy className="p-0 ml-4" text={newApiToken} />
            </div>

            <div className="text-secondary text-sm font-normal">
              <Trans
                i18nKey="api_token_token_created_about_expiry"
                components={{
                  date: <FormattedDate iso={newApiTokenExpiry} hourCycle="h24" dateStyle="medium" timeStyle="medium" />
                }}
              />
            </div>

            <button type="button" className="jj-btn btn-accent w-full mt-6" onClick={() => {
              onDismiss?.();
              onSuccess?.();

              setTimeout(() => {
                setNewApiToken(undefined);
                setNewApiTokenExpiry(undefined);
              }, 300);
            }}>
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
              <button type="submit" className={`jj-btn btn-accent w-full ${isPending ? 'loading' : ''}`}>
                <span>{t('create')}</span>
              </button>
              {error ? (
                <div className="text-red-500 text-[12px] leading-[14px] mt-2 px-1">
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