import { FC } from 'react';
import Modal, { ModalProps } from '../../modal-base/modal.tsx';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { FormattedDate } from '../../formatters/formatted-date.tsx';
import { User } from '../../../types';
import { fetchFn } from '../../../utils/query-fn.ts';

export interface ModalDeleteUserProps extends ModalProps {
  user?: User | null;
  onSuccess: () => void;
}

export const ModalDeleteUser: FC<ModalDeleteUserProps> = ({ isOpen, onDismiss, user, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {user ? <ModalContent onDismiss={onDismiss} user={user} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalDeleteUserProps, 'isOpen' | 'user'> & { user: User }> = ({ onDismiss, onSuccess, user }) => {
  const { t } = useTranslation();

  const { mutate, isPending, error } = useMutation({
    async mutationFn(name: string) {
      const data = await fetchFn<{ user: User }>(`/api/v1/user/${name}`, {
        method: 'DELETE',
      });
      return data.user;
    },
    onSuccess: () => onSuccess(),
  });

  return (
    <div className="modal modal-confirmation w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('deleting_user_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()}>
          <i className="icon icon-close"/>
        </button>
      </div>
      <div className="modal-content">
        <div className="pt-2 pb-4">
          <div className="grid grid-cols-[min-content_minmax(0,1fr)] mb-4 gap-y-1 gap-x-4">
            <div className="text-secondary text-right font-light text-base">ID:</div>
            <div>{user.id}</div>
            <div className="text-secondary text-right font-light text-base"><Trans i18nKey="name"/>:</div>
            <div>{user.name}</div>
            <div className="text-secondary text-right font-light text-base"><Trans i18nKey="joined"/>:</div>
            <div><FormattedDate iso={user.createdAt} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
            </div>
          </div>

          <hr className="border-t-primary mb-3"/>

          <div className="text-start text-secondary">
            <Trans i18nKey="deleting_user_modal_summary" values={{ name: user.name }}/>
          </div>
        </div>
        <div>
          {isPending ? (
            <button type="button" className="btn-primary w-full" disabled>
              <div className="jj jj-spinner"/>
            </button>
          ) : (
            <button type="button" className="btn-primary w-full" onClick={() => mutate(user.name)}>
              <span>{t('delete')}</span>
            </button>
          )}

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