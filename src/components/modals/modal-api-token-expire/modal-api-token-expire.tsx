import { FC, useContext } from 'react';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { ApiToken } from '../../../types';
import { fetchWithContext } from '../../../utils/query-fn.ts';
import { ApplicationContext } from '@app-context/application';

export interface ModalApiTokenExpireProps extends ModalProps {
  apiToken?: ApiToken | null;
  onSuccess: () => void;
}

export const ModalApiTokenExpire: FC<ModalApiTokenExpireProps> = ({ isOpen, onDismiss, apiToken, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {apiToken ? <ModalContent onDismiss={onDismiss} apiToken={apiToken} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalApiTokenExpireProps, 'isOpen' | 'apiToken'> & { apiToken: ApiToken }> = props => {
  const { onDismiss, onSuccess, apiToken } = props;
  const { storage } = useContext(ApplicationContext);
  const { t } = useTranslation();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: { prefix: string }) {
      const data = await fetchWithContext<{ apiToken: ApiToken }>(`/api/v1/apikey/expire`, {
        method: 'POST',
        body: JSON.stringify(values)
      }, storage);
      return data.apiToken;
    },
    onSuccess: () => {
      onSuccess();
      onDismiss();
    },
  });

  return (
    <div className="modal w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('expire_api_token_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="text-secondary mb-3">
            <Trans i18nKey="expire_modal_message" />
          </div>

          <hr className="border-t-primary mb-3"/>

          <div className="text-start grid grid-cols-[0.4fr,1fr] gap-y-2">
            <div className="text-secondary text-sm self-center whitespace-nowrap"><Trans i18nKey="api_token"/>:&nbsp;</div>
            <div className="truncate text-primary self-center">{apiToken.prefix}</div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className={`btn btn-accent w-full ${isPending ? 'loading' : ''}`}
            onClick={() => mutate({
              prefix: apiToken.prefix,
            })}
          >
            <span>{t('expiry')}</span>
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