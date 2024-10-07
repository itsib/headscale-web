import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import Modal, { ModalProps } from '../../modal-base/modal.tsx';
import { fetchFn } from '../../../utils/query-fn.ts';
import { Node } from '../../../types';

export interface ModalNodeRenameProps extends ModalProps {
  node?: Node | null;
  onSuccess: () => void;
}

export const ModalNodeRename: FC<ModalNodeRenameProps> = ({ isOpen, onDismiss, node, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {node ? <ModalContent onDismiss={onDismiss} node={node} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalNodeRenameProps, 'isOpen' | 'node'> & { node: Node }> = ({ onDismiss, onSuccess, node }) => {
  const { t } = useTranslation();
  const currentName = node.givenName || node.name;

  const { handleSubmit, register, formState, watch } = useForm({
    defaultValues: {
      name: currentName,
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn({ id, newName }: { id: string, newName: string }) {
      const data = await fetchFn<{ node: Node }>(`/api/v1/node/${id}/rename/${newName}`, {
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
          <span>{t('renaming_node_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()}>
          <i className="icon icon-close"/>
        </button>
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit((values: { name: string }) => mutate({ id: node.id, newName: values.name }))}>
          <div className="mb-4">
            <Input
              id="new-user-name"
              autoFocus
              label={t('device_name')}
              error={errors?.name}
              {...register('name', {
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
            <button type="submit" className="btn-primary w-full" disabled={currentName === watch('name')}>
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