import { useMemo } from 'preact/hooks';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input, Select, SelectOption } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchFn } from '@app-utils/query-fn.ts';
import { useUsers } from '@app-hooks/use-users';
import { BtnCopy } from '../../btn-copy/btn-copy.tsx';
import { FunctionComponent } from 'preact';
import { Storage } from '@app-utils/storage.ts';
import { UserPhoto } from '@app-components/user-info/user-photo.tsx';

interface FormFields {
  nodekey: string;
  user: string;
}

export interface ModalNodeRegisterProps extends ModalProps {
  onSuccess: () => void;
}

export const ModalNodeCreate: FunctionComponent<ModalNodeRegisterProps> = ({
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

const ModalContent: FunctionComponent<Omit<ModalNodeRegisterProps, 'isOpen'>> = ({
  onDismiss,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { data: users } = useUsers();
  const url = useMemo(() => Storage.get().getItem('main-url'), []);

  const options: SelectOption[] = useMemo(() => {
    if (!users) {
      return [];
    }
    return users.map((user) => ({
      value: user.id,
      label: user.email || user.displayName || user.name,
      icon: <UserPhoto id={user.id} pictureUrl={user.profilePicUrl} size="sm" />,
    }));
  }, [users]);

  const { handleSubmit, register, formState } = useForm<FormFields>({
    defaultValues: {
      nodekey: '',
      user: options[0]?.value,
    },
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn({ nodekey, user }: FormFields) {
      const queryParams = '?user=' + user + '&key=' + nodekey;
      return await fetchFn<Node>(`/api/v1/node/register${queryParams}`, { method: 'POST' });
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
          <span>{t('register_node_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit(mutate as any)}>
          <div className="mb-2">
            <Input
              id="node-key-input"
              label={t('node_key')}
              placeholder="nodekey:"
              error={errors?.nodekey}
              {...register('nodekey', {
                required: t('error_required'),
                validate: (value) =>
                  value.startsWith('mkey:') || value.startsWith('nodekey:')
                    ? true
                    : t('error_nodekey_format'),
              })}
            />
          </div>

          <div className="mb-2">
            <Select
              id="owner-selector"
              label={t('device_owner')}
              options={options}
              error={errors?.user}
              {...register('user', {
                required: t('error_required'),
              })}
            />
          </div>
          <div className="text-sm text-secondary mb-4">
            <Trans i18nKey="tailscale_up_command_before" />
            <div className="border border-secondary rounded-md py-2 px-3 my-1 relative">
              <span>tailscale up --login-server {url}</span>

              <div className="absolute right-2 top-2">
                <BtnCopy text={`tailscale up --login-server ${url}`} className="" />
              </div>
            </div>
            <Trans i18nKey="tailscale_up_command_after" />
          </div>

          <div>
            <button type="submit" className="btn btn-accent w-full" data-loading={isPending}>
              <span>{t('create')}</span>
            </button>
            {error ? (
              <div className="text-red-500 text-[12px] leading-[14px] mt-2 px-1">
                {t(error.message)}
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};
