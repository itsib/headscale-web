import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import Modal, { ModalProps } from '../../modal-base/modal.tsx';
import { fetchFn } from '../../../utils/query-fn.ts';
import { User } from '../../../types';

export interface ModalRenameUserProps extends ModalProps {
  user?: User | null;
  onSuccess: () => void;
}

export const ModalRenameUser: FC<ModalRenameUserProps> = ({ isOpen, onDismiss, user, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {user ? <ModalContent onDismiss={onDismiss} user={user} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalRenameUserProps, 'isOpen' | 'user'> & { user: User }> = ({ onDismiss, onSuccess, user }) => {
  const { t } = useTranslation();

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: user.name,
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn({ oldName, newName }: { oldName: string, newName: string }) {
      const data = await fetchFn<{ user: User }>(`/api/v1/user/${oldName}/rename/${newName}`, {
        method: 'POST',
      });
      return data.user;
    },
    onSuccess: () => onSuccess(),
  });

  return (
    <div className="modal modal-confirmation w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('renaming_user_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()}>
          <i className="icon icon-close"/>
        </button>
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit((values: { name: string }) => mutate({ oldName: user.name, newName: values.name }))}>
          <div className="mb-4">
            <Input
              id="new-user-name"
              label={t('new_name')}
              error={errors?.name}
              {...register('name', {
                required: t('error_required'),
                validate: (value: string) => /^[a-z0-9]+$/.test(value) ? true : t('error_invalid_name'),
                disabled: isPending,
              })}
            />
          </div>

          {isPending ? (
            <button type="button" className="btn-primary w-full" disabled>
              <div className="jj jj-spinner"/>
            </button>
          ) : (
            <button type="submit" className="btn-primary w-full">
              <span>{t('rename')}</span>
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