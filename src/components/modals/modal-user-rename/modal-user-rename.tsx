import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchWithContext } from '../../../utils/query-fn.ts';
import { User } from '../../../types';
import ApplicationContext from '../../../context/application/application.context.ts';

export interface ModalUserRenameProps extends ModalProps {
  user?: User | null;
  onSuccess: () => void;
}

export const ModalUserRename: FC<ModalUserRenameProps> = ({ isOpen, onDismiss, user, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {user ? <ModalContent onDismiss={onDismiss} user={user} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalUserRenameProps, 'isOpen' | 'user'> & { user: User }> = ({ onDismiss, onSuccess, user }) => {
  const { t } = useTranslation();
  const { storage } = useContext(ApplicationContext);

  const { handleSubmit, register, formState } = useForm<{ name: string }>({
    defaultValues: {
      name: user.name,
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn({ id, newName }: { id: string, newName: string }) {
      const data = await fetchWithContext<{ user: User }>(`/api/v1/user/${id}/rename/${newName}`, {
        method: 'POST',
      }, storage);
      return data.user;
    },
    onSuccess: () => {
      onSuccess();
      onDismiss();
    },
  });

  function submit(values: { name: string }) {
    mutate({ id: user.id, newName: values.name });
  }

  return (
    <div className="modal modal-confirmation w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('renaming_user_modal_title')}</span>
        </div>
        <button type="button" className="jj-btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-4">
            <Input
              id="new-user-name"
              label={t('new_name')}
              error={errors?.name}
              {...register('name', {
                required: t('error_required'),
                validate: (value: string) => /^[a-z0-9-_:]+$/.test(value) ? true : t('error_invalid_name'),
                disabled: isPending,
              })}
            />
          </div>

          <button
            type="submit"
            className={`jj-btn btn-accent w-full ${isPending ? 'loading' : ''}`}
          >
            <span>{t('rename')}</span>
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