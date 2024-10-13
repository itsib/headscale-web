import { FC } from 'react';
import { ModalProps, Modal } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { FormattedDate } from '../../formatters/formatted-date.tsx';
import { ApiToken, Node } from '../../../types';
import { fetchFn } from '../../../utils/query-fn.ts';

export interface ModalApiTokenDeleteProps extends ModalProps {
  apiToken?: ApiToken | null;
  onSuccess: () => void;
}

export const ModalApiTokenDelete: FC<ModalApiTokenDeleteProps> = ({ isOpen, onDismiss, apiToken, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {apiToken ? <ModalContent onDismiss={onDismiss} apiToken={apiToken} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalApiTokenDeleteProps, 'isOpen' | 'node'> & { apiToken: ApiToken }> = ({ onDismiss, onSuccess, apiToken }) => {
  const { t } = useTranslation();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(prefix: string) {
      const data = await fetchFn<{ node: Node }>(`/api/v1/apikey/${prefix}`, {
        method: 'DELETE',
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
          <span>{t('deleting_api_token_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="grid grid-cols-[min-content_minmax(0,1fr)] mb-4 gap-y-1 gap-x-4">
            <div className="text-secondary text-right font-light text-base">ID:</div>
            <div>{apiToken.id}</div>
            <div className="text-secondary text-right font-light text-base whitespace-nowrap">
              <Trans i18nKey="name"/>:
            </div>
            <div>
              <FormattedDate iso={apiToken.createdAt} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
            </div>
            <div className="text-secondary text-right font-light text-base whitespace-nowrap">
              <Trans i18nKey="expired_at"/>:
            </div>
            <div>
              <FormattedDate iso={apiToken.expiration} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
            </div>
            <div className="text-secondary text-right font-light text-base whitespace-nowrap">
              <Trans i18nKey="last_seen"/>:
            </div>
            <div>
              {apiToken.lastSeen ? (
                <FormattedDate iso={apiToken.lastSeen} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
              ) : (
                <>-</>
              )}
            </div>
          </div>

          <hr className="border-t-primary mb-3"/>

          <div className="text-start text-secondary">
            <Trans i18nKey="deleting_api_token_modal_summary" values={{ prefix: apiToken.prefix }} />
          </div>
        </div>
        <div>
          <button
            type="button"
            className={`btn btn-accent w-full ${isPending ? 'loading' : ''}`}
            onClick={() => mutate(apiToken.prefix)}
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