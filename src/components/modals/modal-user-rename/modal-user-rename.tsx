import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchFn } from '@app-utils/query-fn';
import { User } from '@app-types';
import { FunctionComponent } from 'preact';
import { ModalHeader } from '@app-components/modals/modal-header.tsx';

export interface ModalUserRenameProps extends ModalProps {
  user?: User | null;
}

export const ModalUserRename: FunctionComponent<ModalUserRenameProps> = ({
  isOpen,
  onDismiss,
  user,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {user ? <ModalContent onDismiss={onDismiss} user={user} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FunctionComponent<
  Omit<ModalUserRenameProps, 'isOpen' | 'user'> & { user: User }
> = ({ onDismiss, user }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { handleSubmit, register, formState } = useForm<{ name: string }>({
    defaultValues: {
      name: user.name,
    },
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn({ id, newName }: { id: string; newName: string }) {
      const data = await fetchFn<{ user: User }>(`/api/v1/user/${id}/rename/${newName}`, {
        method: 'POST',
        body: '{}',
      });
      return data.user;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/v1/user', 'GET'] });
      onDismiss();
    },
  });

  function submit(values: { name: string }) {
    mutate({ id: user.id, newName: values.name });
  }

  return (
    <div className="modal modal-md">
      <ModalHeader caption="renaming_user_modal_title" onDismiss={onDismiss} />
      <div className="modal-content">
        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-4">
            <Input
              id="new-user-name"
              label={t('new_name')}
              error={errors?.name}
              {...register('name', {
                required: t('error_required'),
                validate: (value: string) =>
                  /^[a-z0-9-_:]+$/.test(value) ? true : t('error_invalid_name'),
                disabled: isPending,
              })}
            />
          </div>

          <button type="submit" className="btn btn-accent w-full" data-loading={isPending}>
            <span>{t('rename')}</span>
          </button>
          {error ? (
            <div className="error-message">
              {t(error.message)}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};
