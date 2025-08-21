import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { email, Input, url } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchFn } from '@app-utils/query-fn';
import { User, UserCreateFields } from '@app-types';
import { FunctionComponent } from 'preact';

export interface ModalUserCreateProps extends ModalProps {
  onSuccess: () => void;
}

export const ModalUserCreate: FunctionComponent<ModalUserCreateProps> = ({
  isOpen,
  onDismiss,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent onDismiss={onDismiss} {...props} />
    </Modal>
  );
};

const ModalContent: FunctionComponent<Omit<ModalUserCreateProps, 'isOpen'>> = ({
  onDismiss,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const { handleSubmit, register, formState } = useForm<UserCreateFields>({
    defaultValues: {
      name: '',
      displayName: '',
      email: '',
      pictureUrl: '',
    },
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: UserCreateFields) {
      const data = await fetchFn<{ user: User }>('/api/v1/user', {
        method: 'POST',
        body: JSON.stringify(values),
      });
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
          <span>{t('creating_user_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit(mutate as any)}>
          <div className="mb-4">
            <Input
              id="new-user-name"
              label={t('user_name')}
              error={errors?.name}
              {...register('name', {
                required: t('error_required'),
              })}
            />
          </div>

          <div className="mb-2">
            <Input
              id="new-user-display-name"
              label={t('user_display_name')}
              error={errors?.displayName}
              {...register('displayName', {
                required: t('error_required'),
              })}
            />
          </div>

          <div className="mb-2">
            <Input
              id="new-user-email"
              type="email"
              label={t('user_email')}
              error={errors?.email}
              {...register('email', {
                required: t('error_required'),
                validate: email('error_invalid_email'),
              })}
            />
          </div>

          <div className="mb-2">
            <Input
              id="new-user-avatar"
              type="url"
              label={t('user_photo')}
              error={errors?.pictureUrl}
              {...register('pictureUrl', {
                validate: url('error_invalid_url'),
              })}
            />
          </div>

          <button type="submit" className="btn btn-accent w-full" data-loading={isPending}>
            <span>{t('create')}</span>
          </button>
          {error ? (
            <div className="text-red-500 text-[12px] leading-[14px] mt-2 px-1">
              {t(error.message)}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};
