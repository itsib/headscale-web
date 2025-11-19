import { Modal, ModalProps } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormattedDate } from '../../formatters/formatted-date.tsx';
import { ApiToken, Device } from '@app-types';
import { fetchFn } from '@app-utils/query-fn';
import type { FC } from 'react';
import { ModalHeader } from '@app-components/modals/modal-header.tsx';

export interface ModalApiTokenDeleteProps extends ModalProps {
  apiToken?: ApiToken | null;
}

export const ModalApiTokenDelete: FC<ModalApiTokenDeleteProps> = ({
  isOpen,
  onDismiss,
  apiToken,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {apiToken ? <ModalContent onDismiss={onDismiss} apiToken={apiToken} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<
  Omit<ModalApiTokenDeleteProps, 'isOpen' | 'node'> & {
    apiToken: ApiToken;
  }
> = ({ onDismiss, apiToken }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(prefix: string) {
      const data = await fetchFn<{ node: Device }>(`/api/v1/apikey/${prefix}`, {
        method: 'DELETE',
      });
      return data.node;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/v1/apikey', 'GET'] });
      onDismiss();
    },
  });

  return (
    <div className="modal modal-md">
      <ModalHeader caption="deleting_api_token_modal_title" onDismiss={onDismiss} />
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="info-rows">
            <div className="property">ID:</div>
            <div>{apiToken.id}</div>
            <div className="property">
              <Trans i18nKey="name" />:
            </div>
            <div>
              <FormattedDate date={apiToken.createdAt} />
            </div>
            <div className="property">
              <Trans i18nKey="expired_at" />:
            </div>
            <div>
              <FormattedDate date={apiToken.expiration} />
            </div>
            <div className="property">
              <Trans i18nKey="last_seen" />:
            </div>
            <div>{apiToken.lastSeen ? <FormattedDate date={apiToken.lastSeen} /> : <>-</>}</div>
          </div>

          <hr />

          <div className="summary">
            <Trans
              i18nKey="deleting_api_token_modal_summary"
              values={{ prefix: apiToken.prefix }}
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-outline-danger w-full"
            data-loading={isPending}
            onClick={() => mutate(apiToken.prefix)}
          >
            <span>{t('delete')}</span>
          </button>

          {error ? <div className="error-message">{t(error.message)}</div> : null}
        </div>
      </div>
    </div>
  );
};
