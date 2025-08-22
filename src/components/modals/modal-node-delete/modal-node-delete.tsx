import { Modal, ModalProps } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Device } from '@app-types';
import { fetchFn } from '@app-utils/query-fn';
import { FunctionComponent } from 'preact';
import { ModalHeader } from '@app-components/modals/modal-header.tsx';
import { DeviceInfo } from '@app-components/device-info/device-info.tsx';

export interface ModalNodeDeleteProps extends ModalProps {
  node?: Device | null;
  onSuccess: () => void;
}

export const ModalNodeDelete: FunctionComponent<ModalNodeDeleteProps> = ({
  isOpen,
  onDismiss,
  node,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {node ? <ModalContent onDismiss={onDismiss} node={node} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FunctionComponent<
  Omit<ModalNodeDeleteProps, 'isOpen' | 'node'> & { node: Device }
> = ({ onDismiss, onSuccess, node }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(nodeId: string) {
      const data = await fetchFn<{ node: Device }>(`/api/v1/node/${nodeId}`, {
        method: 'DELETE',
      });
      return data.node;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/v1/node', 'GET'] });
      onSuccess();
      onDismiss();
    },
  });

  return (
    <div className="modal modal-md">
      <ModalHeader caption="removing_device" onDismiss={onDismiss} />
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <DeviceInfo device={node} />
          <hr />
          <div className="summary">
            <Trans
              i18nKey="removing_device_confirmation"
              values={{ name: node.givenName || node.name }}
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-accent w-full"
            data-loading={isPending}
            onClick={() => mutate(node.id)}
          >
            <span>{t('delete')}</span>
          </button>

          {error ? <div className="error-message">{t(error.message)}</div> : null}
        </div>
      </div>
    </div>
  );
};
