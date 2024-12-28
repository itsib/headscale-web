import { FC, useContext } from 'react';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { FormattedDate } from '../../formatters/formatted-date.tsx';
import { Node } from '../../../types';
import { fetchWithContext } from '../../../utils/query-fn.ts';
import ApplicationContext from '../../../context/application/application.context.ts';

export interface ModalNodeDeleteProps extends ModalProps {
  node?: Node | null;
  onSuccess: () => void;
}

export const ModalNodeDelete: FC<ModalNodeDeleteProps> = ({ isOpen, onDismiss, node, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {node ? <ModalContent onDismiss={onDismiss} node={node} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalNodeDeleteProps, 'isOpen' | 'node'> & { node: Node }> = ({ onDismiss, onSuccess, node }) => {
  const { t } = useTranslation();
  const { storage } = useContext(ApplicationContext);

  const { mutate, isPending, error } = useMutation({
    async mutationFn(nodeId: string) {
      const data = await fetchWithContext<{ node: Node }>(`/api/v1/node/${nodeId}`, {
        method: 'DELETE',
      }, storage);
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
          <span>{t('deleting_node_modal_title')}</span>
        </div>
        <button type="button" className="jj-btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="grid grid-cols-[min-content_minmax(0,1fr)] mb-4 gap-y-1 gap-x-4">
            <div className="text-secondary text-right font-light text-base">ID:</div>
            <div>{node.id}</div>
            <div className="text-secondary text-right font-light text-base whitespace-nowrap">
              <Trans i18nKey="name"/>:
            </div>
            <div>{node.name}</div>
            <div className="text-secondary text-right font-light text-base whitespace-nowrap">
              <Trans i18nKey="given_name"/>:
            </div>
            <div>{node.givenName}</div>
            <div className="text-secondary text-right font-light text-base whitespace-nowrap">
              <Trans i18nKey="ip_address"/>:
            </div>
            <div>{node.ipAddresses[0]}</div>
            <div className="text-secondary text-right font-light text-base whitespace-nowrap">
              <Trans i18nKey="created_at"/>:
            </div>
            <div>
              <FormattedDate iso={node.createdAt} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
            </div>
            <div className="text-secondary text-right font-light text-base whitespace-nowrap">
              <Trans i18nKey="last_seen"/>:
            </div>
            <div>
              <FormattedDate iso={node.lastSeen} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
            </div>
          </div>

          <hr className="border-t-primary mb-3"/>

          <div className="text-start text-secondary">
            <Trans i18nKey="deleting_node_modal_summary" values={{ name: node.givenName || node.name }}/>
          </div>
        </div>
        <div>
          <button
            type="button"
            className={`jj-btn btn-accent w-full ${isPending ? 'loading' : ''}`}
            onClick={() => mutate(node.id)}
          >
            <span>{t('delete')}</span>
          </button>

          {error ? (
            <div className="text-red-500 text-[12px] leading-[14px] mt-2">
              {t(error.message)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};