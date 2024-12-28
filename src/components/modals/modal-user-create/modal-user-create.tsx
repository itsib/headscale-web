import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { email, Input } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchWithContext } from '../../../utils/query-fn.ts';
import { User, UserIdentity } from '../../../types';
import ApplicationContext from '../../../context/application/application.context.ts';

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
  const { storage } = useContext(ApplicationContext);

  const { handleSubmit, register, formState } = useForm<UserIdentity>({
    defaultValues: {
      name: '',
      displayName: '',
      email: '',
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: UserIdentity) {
      const data = await fetchWithContext<{ user: User }>('/api/v1/user', {
        method: 'POST',
        body: JSON.stringify(values),
      }, storage);
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
        <button type="button" className="jj-btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit(mutate as any)}>
          <div className="mb-4">
            <Input
              id="new-user-name"
              label={t('user_name')}
              error={errors?.name}
              {...register('name', {
                required: t('error_required'),
              })}
            />
          </div>

          <div className="mb-2">
            <Input
              id="new-user-display-name"
              label={t('user_display_name')}
              error={errors?.displayName}
              {...register('displayName', {
                required: t('error_required'),
              })}
            />
          </div>

          <div className="mb-2">
            <Input
              id="new-user-email"
              type="email"
              label={t('user_email')}
              error={errors?.email}
              {...register('email', {
                required: t('error_required'),
                validate: email('error_invalid_email'),
              })}
            />
          </div>

          <button type="submit" className={`jj-btn btn-accent w-full ${isPending ? 'loading' : ''}`}>
            <span>{t('create')}</span>
          </button>
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