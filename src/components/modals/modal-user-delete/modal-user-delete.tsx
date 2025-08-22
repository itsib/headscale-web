import { Modal, ModalProps } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormattedDate } from '../../formatters/formatted-date.tsx';
import { User } from '@app-types';
import { fetchFn } from '@app-utils/query-fn.ts';
import { FunctionComponent } from 'preact';
import { ModalHeader } from '@app-components/modals/modal-header.tsx';

export interface ModalUserDeleteProps extends ModalProps {
  user?: User | null;
}

export const ModalUserDelete: FunctionComponent<ModalUserDeleteProps> = ({
  isOpen,
  onDismiss,
  user,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {user ? <ModalContent onDismiss={onDismiss} user={user} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FunctionComponent<
  Omit<ModalUserDeleteProps, 'isOpen' | 'user'> & { user: User }
> = ({ onDismiss, user }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(name: string) {
      const data = await fetchFn<{ user: User }>(`/api/v1/user/${name}`, {
        method: 'DELETE',
      });
      return data.user;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/v1/user', 'GET'] });
      onDismiss();
    },
  });

  return (
    <div className="modal modal-md">
      <ModalHeader caption="deleting_user_modal_title" onDismiss={onDismiss} />
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="info-rows">
            <div className="property">ID:</div>
            <div>{user.id}</div>
            <div className="property">
              <Trans i18nKey="login" />:
            </div>
            <div>{user.name}</div>
            <div className="property">
              <Trans i18nKey="name" />:
            </div>
            <div>{user.displayName}</div>
            <div className="property">
              <Trans i18nKey="email" />:
            </div>
            <div>{user.email}</div>
            <div className="property">
              <Trans i18nKey="joined" />:
            </div>
            <div>
              {' '}
              <FormattedDate date={user.createdAt} />
            </div>
          </div>

          <hr />

          <div className="summary">
            <Trans i18nKey="deleting_user_modal_summary" values={{ name: user.name || user.displayName || user.email }} />
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-accent w-full"
            data-loading={isPending}
            onClick={() => mutate(user.id)}
          >
            <span>{t('delete')}</span>
          </button>

          {error ? (
            <div className="error-message">{t(error.message)}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
