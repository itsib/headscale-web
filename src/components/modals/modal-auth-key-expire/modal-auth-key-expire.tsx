import { FC, useContext } from 'react';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { AuthKeyWithUser, User } from '../../../types';
import { fetchWithContext } from '../../../utils/query-fn.ts';
import ApplicationContext from '../../../context/application/application.context.ts';

export interface ModalAuthKeyExpireProps extends ModalProps {
  authKey?: AuthKeyWithUser | null;
  onSuccess: () => void;
}

export const ModalAuthKeyExpire: FC<ModalAuthKeyExpireProps> = ({ isOpen, onDismiss, authKey, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {authKey ? <ModalContent onDismiss={onDismiss} authKey={authKey} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalAuthKeyExpireProps, 'isOpen' | 'authKey'> & { authKey: AuthKeyWithUser }> = props => {
  const { onDismiss, onSuccess, authKey } = props;
  const { storage } = useContext(ApplicationContext);
  const { t } = useTranslation();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: { user: string, key: string }) {
      const data = await fetchWithContext<{ user: User }>(`/api/v1/preauthkey/expire`, {
        method: 'POST',
        body: JSON.stringify(values)
      }, storage);
      return data.user;
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
          <span>{t('expire_auth_key_modal_title')}</span>
        </div>
        <button type="button" className="jj-btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="text-secondary mb-3">
            <Trans i18nKey="expire_modal_message" />
          </div>

          <hr className="border-t-primary mb-3"/>

          <div className="text-start grid grid-cols-[0.4fr,1fr] gap-y-2">
            <div className="text-secondary text-sm self-center whitespace-nowrap"><Trans i18nKey="auth_key"/>:&nbsp;</div>
            <div className="truncate text-primary self-center">{authKey.key}</div>
            <div className="text-secondary text-sm self-center whitespace-nowrap"><Trans i18nKey="user_name"/>:&nbsp;</div>
            <div className="truncate text-primary self-center">{authKey.user.name}</div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className={`jj-btn btn-accent w-full ${isPending ? 'loading' : ''}`}
            onClick={() => mutate({
              user: authKey.user.name,
              key: authKey.key,
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