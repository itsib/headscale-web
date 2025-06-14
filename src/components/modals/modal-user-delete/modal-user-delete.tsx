import { Modal, ModalProps } from 'react-just-ui/modal';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { FormattedDate } from '../../formatters/formatted-date.tsx';
import { User } from '@app-types';
import { fetchFn } from '@app-utils/query-fn.ts';
import { FunctionComponent } from 'preact';

export interface ModalUserDeleteProps extends ModalProps {
  user?: User | null;
  onSuccess: () => void;
}

export const ModalUserDelete: FunctionComponent<ModalUserDeleteProps> = ({ isOpen, onDismiss, user, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {user ? <ModalContent onDismiss={onDismiss} user={user} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FunctionComponent<Omit<ModalUserDeleteProps, 'isOpen' | 'user'> & { user: User }> = ({
                                                                                                           onDismiss,
                                                                                                           onSuccess,
                                                                                                           user,
                                                                                                         }) => {
  const { t } = useTranslation();


  const { mutate, isPending, error } = useMutation({
    async mutationFn(name: string) {
      const data = await fetchFn<{ user: User }>(`/api/v1/user/${name}`, {
        method: 'DELETE',
      });
      return data.user;
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
          <span>{t('deleting_user_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()}/>
      </div>
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="grid grid-cols-[min-content_minmax(0,1fr)] mb-4 gap-y-1 gap-x-4">
            <div className="text-secondary text-right font-light text-base">ID:</div>
            <div>{user.id}</div>
            <div className="text-secondary text-right font-light text-base"><Trans i18nKey="login"/>:</div>
            <div>{user.name}</div>
            <div className="text-secondary text-right font-light text-base"><Trans i18nKey="name"/>:</div>
            <div>{user.displayName}</div>
            <div className="text-secondary text-right font-light text-base"><Trans i18nKey="email"/>:</div>
            <div>{user.email}</div>
            <div className="text-secondary text-right font-light text-base"><Trans i18nKey="joined"/>:</div>
            <div> <FormattedDate date={user.createdAt} />
            </div>
          </div>

          <hr className="border-t-primary mb-3"/>

          <div className="text-start text-secondary">
            <Trans i18nKey="deleting_user_modal_summary" values={{ name: user.name }}/>
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
            <div className="text-red-500 text-[12px] leading-[14px] mt-2">
              {t(error.message)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};