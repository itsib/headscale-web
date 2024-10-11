import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { ModalProps, Modal } from 'react-just-ui/modal';
import { fetchFn } from '../../../utils/query-fn.ts';
import { User } from '../../../types';

export interface ModalUserCreateProps extends ModalProps {
  onSuccess: () => void;
}

export const ModalUserCreate: FC<ModalUserCreateProps> = ({ isOpen, onDismiss, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent onDismiss={onDismiss} {...props} />
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalUserCreateProps, 'isOpen'>> = ({ onDismiss, onSuccess }) => {
  const { t } = useTranslation();

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: '',
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: { name: string }) {
      const data = await fetchFn<{ user: User }>('/api/v1/user', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      return data.user;
    },
    onSuccess: () => {
      onSuccess();
      onDismiss();
    },
  });

  return (
    <div className="modal w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('creating_user_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()}>
          <i className="icon icon-close"/>
        </button>
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit(mutate as any)}>
          <div className="mb-4">
            <Input
              id="new-user-name"
              label={t('user_name')}
              error={errors?.name}
              {...register('name', { required: t('error_required') })}
            />
          </div>

          {isPending ? (
            <button type="button" className="btn-primary w-full" disabled>
              <div className="jj jj-spinner"/>
            </button>
          ) : (
            <button type="submit" className="btn-primary w-full">
              <span>{t('create')}</span>
            </button>
          )}
          {error ? (
            <div className="text-red-500 text-[12px] leading-[14px] mt-2 px-1">
              {t(error.message)}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};