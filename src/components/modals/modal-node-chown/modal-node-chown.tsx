import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Select, SelectOption } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import Modal, { ModalProps } from '../../modal-base/modal.tsx';
import { fetchFn } from '../../../utils/query-fn.ts';
import { Node } from '../../../types';
import { useUsers } from '../../../hooks/use-users.ts';
import { getAvatarUrl } from '../../../utils/get-avatar-url.ts';

export interface ModalNodeChownProps extends ModalProps {
  node?: Node | null;
  onSuccess: () => void;
}

export const ModalNodeChown: FC<ModalNodeChownProps> = ({ isOpen, onDismiss, node, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {node ? <ModalContent onDismiss={onDismiss} node={node} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalNodeChownProps, 'isOpen' | 'node'> & { node: Node }> = ({ onDismiss, onSuccess, node }) => {
  const { t } = useTranslation();
  const { data: users } = useUsers();

  const options: SelectOption[] = useMemo(() => {
    if (!users) {
      return [];
    }
    return users.map(user => ({
      value: user.name,
      label: user.name,
      icon: getAvatarUrl(user.id),
    }));
  }, [users]);

  const { handleSubmit, register, formState, watch } = useForm<{ userName: string }>({
    defaultValues: {
      userName: node.user.name,
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn({ id, userName }: { id: string, userName: string }) {
      const data = await fetchFn<{ node: Node }>(`/api/v1/node/${id}/user?user=${userName}`, {
        method: 'POST',
      });
      return data.node;
    },
    onSuccess: () => {
      onSuccess();
      onDismiss();
    },
  });

  return (
    <div className="modal modal-confirmation w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('chown_node_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()}>
          <i className="icon icon-close"/>
        </button>
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit((values: { userName: string }) => mutate({ id: node.id, userName: values.userName }))}>
          <div className="mb-4">
            <Select
              id="new-user-name"
              options={options}
              label={t('device_owner')}
              error={errors?.userName}
              {...register('userName', {
                required: t('error_required'),
                disabled: isPending,
              })}
            />
          </div>

          {isPending ? (
            <button type="button" className="btn-primary w-full" disabled>
              <div className="jj jj-spinner"/>
            </button>
          ) : (
            <button type="submit" className="btn-primary w-full" disabled={node.user.name === watch('userName')}>
              <span>{t('apply')}</span>
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