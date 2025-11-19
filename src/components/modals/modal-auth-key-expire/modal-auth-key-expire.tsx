import { Modal, ModalProps } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthKeyWithUser, User } from '@app-types';
import { fetchFn } from '@app-utils/query-fn.ts';
import { FC } from 'react';
import { ModalHeader } from '@app-components/modals/modal-header.tsx';

export interface ModalAuthKeyExpireProps extends ModalProps {
  authKey?: AuthKeyWithUser | null;
}

export const ModalAuthKeyExpire: FC<ModalAuthKeyExpireProps> = ({
  isOpen,
  onDismiss,
  authKey,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {authKey ? <ModalContent onDismiss={onDismiss} authKey={authKey} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<
  Omit<ModalAuthKeyExpireProps, 'isOpen' | 'authKey'> & {
    authKey: AuthKeyWithUser;
  }
> = (props) => {
  const { onDismiss, authKey } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: { user: string; key: string }) {
      const data = await fetchFn<{ user: User }>(`/api/v1/preauthkey/expire`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      return data.user;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/v1/preauthkey'] });
      onDismiss();
    },
  });

  return (
    <div className="modal modal-md">
      <ModalHeader caption="expire_auth_key_modal_title" onDismiss={onDismiss} />
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="text-secondary mb-3">
            <Trans i18nKey="expire_modal_message" />
          </div>

          <hr />

          <div className="info-rows">
            <div className="property">
              <Trans i18nKey="auth_key" />
              :&nbsp;
            </div>
            <div className="truncate text-primary self-center">{authKey.key}</div>
            <div className="property">
              <Trans i18nKey="user_name" />
              :&nbsp;
            </div>
            <div className="truncate text-primary self-center">
              {authKey.user.name || authKey.user.displayName || authKey.user.email}
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-accent w-full"
            data-loading={isPending}
            onClick={() =>
              mutate({
                user: authKey.user.id,
                key: authKey.key,
              })
            }
          >
            <span>{t('expiry')}</span>
          </button>

          {error ? <div className="error-message">{t(error.message)}</div> : null}
        </div>
      </div>
    </div>
  );
};
