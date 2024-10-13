import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchFn } from '../../../utils/query-fn.ts';

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

  const { handleSubmit, register, formState } = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: {
      expiration: 90,
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: { expiration: string }) {
      return await fetchFn<Node>(`/api/v1/apikey`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      onSuccess();
      onDismiss();
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
          <span>{t('create_api_token_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
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
            <button type="submit" className={`btn btn-primary w-full ${isPending ? 'loading' : ''}`}>
              <span>{t('create')}</span>
            </button>
            {error ? (
              <div className="text-red-500 text-[12px] leading-[14px] mt-2 px-1">
                {t(error.message)}
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};