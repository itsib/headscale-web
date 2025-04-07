import { useMemo } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Select, SelectOption } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchFn } from '@app-utils/query-fn.ts';
import { Device } from '@app-types';
import { useUsers } from '@app-hooks/use-users.ts';
import { FunctionComponent } from 'preact';

export interface ModalNodeChownProps extends ModalProps {
  node?: Device | null;
  onSuccess: () => void;
}

export const ModalNodeChown: FunctionComponent<ModalNodeChownProps> = ({ isOpen, onDismiss, node, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {node ? <ModalContent onDismiss={onDismiss} node={node} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FunctionComponent<Omit<ModalNodeChownProps, 'isOpen' | 'node'> & { node: Device }> = ({ onDismiss, onSuccess, node }) => {
  const { t } = useTranslation();
  const { data: users } = useUsers();

  const options: SelectOption[] = useMemo(() => {
    if (!users) {
      return [];
    }
    return users.map(user => ({
      value: user.name,
      label: user.name || user.displayName,
      icon: user.profilePicUrl || `icon icon-avatar-${parseInt(user.id) % 10}`,
    }));
  }, [users]);

  const { handleSubmit, register, formState, watch, setError } = useForm<{ name: string }>({
    defaultValues: {
      name: node.user.name,
    }
  });
  const { errors } = formState;

  const { mutate, isPending } = useMutation({
    async mutationFn({ id, name }: { id: string, name: string }) {
      const data = await fetchFn<{ node: Device }>(`/api/v1/node/${id}/user`, {
        method: 'POST',
        body: JSON.stringify({ user: name }),
      });
      return data.node;
    },
    onSuccess: () => {
      onSuccess();
      onDismiss();
    },
    onError: (error: any) => {
      setError('name', { message: t(error.message) });
    }
  });

  return (
    <div className="modal modal-confirmation w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('chown_node_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <form
          onSubmit={handleSubmit((values: { name: string }) => mutate({ id: node.id, name: values.name }))}>
          <div className="mb-4">
            <Select
              id="new-user-name"
              options={options}
              label={t('device_owner')}
              error={errors?.name}
              {...register('name', {
                required: t('error_required'),
                disabled: isPending,
              })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-accent w-full"
            data-loading={isPending}
            disabled={node.user.name === watch('name')}
          >
            <span>{t('apply')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};