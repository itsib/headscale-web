import { Modal, ModalProps } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiToken } from '@app-types';
import { fetchFn } from '@app-utils/query-fn.ts';
import type { FC } from 'react';
import { ModalHeader } from '@app-components/modals/modal-header.tsx';
import './modal-api-token-expire.css';

export interface ModalApiTokenExpireProps extends ModalProps {
  apiToken?: ApiToken | null;
}

export const ModalApiTokenExpire: FC<ModalApiTokenExpireProps> = ({
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
  Omit<ModalApiTokenExpireProps, 'isOpen' | 'apiToken'> & { apiToken: ApiToken }
> = (props) => {
  const { onDismiss, apiToken } = props;
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: { prefix: string }) {
      const data = await fetchFn<{ apiToken: ApiToken }>(`/api/v1/apikey/expire`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      return data.apiToken;
    },
    onSuccess: async () => {
      onDismiss();
      await queryClient.invalidateQueries({ queryKey: ['/api/v1/apikey', 'GET'] });
    },
  });

  return (
    <div className="modal modal-api-token-expire">
      <ModalHeader caption={'expire_api_token_modal_title'} onDismiss={onDismiss} />

      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="text-secondary mb-3">
            <Trans i18nKey="expire_modal_message" />
          </div>

          <hr className="border-t-primary mb-3" />

          <div className="token-info">
            <div className="property">
              <Trans i18nKey="api_token" />
              :&nbsp;
            </div>
            <div className="truncate text-primary self-center">{apiToken.prefix}</div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-accent w-full"
            data-loading={isPending}
            onClick={() =>
              mutate({
                prefix: apiToken.prefix,
              })
            }
          >
            <span>{t('expiry')}</span>
          </button>

          {error ? (
            <div className="text-red-500 text-[12px] leading-[14px] mt-2">{t(error.message)}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
