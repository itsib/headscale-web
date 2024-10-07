import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input, Select, SelectOption } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import Modal, { ModalProps } from '../../modal-base/modal.tsx';
import { fetchFn } from '../../../utils/query-fn.ts';
import { useUsers } from '../../../hooks/use-users.ts';

interface FormFields {
  nodekey: string;
  user: string;
}

export interface ModalNodeRegisterProps extends ModalProps {
  onSuccess: () => void;
}

export const ModalNodeRegister: FC<ModalNodeRegisterProps> = ({ isOpen, onDismiss, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent onDismiss={onDismiss} {...props} />
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalNodeRegisterProps, 'isOpen'>> = ({ onDismiss, onSuccess }) => {
  const { t } = useTranslation();
  const { data: users } = useUsers();

  const options: SelectOption[] = useMemo(() => {
    if (!users) {
      return [];
    }
    return users.map(user => ({
      value: user.name,
      label: user.name,
      icon: `icon icon-avatar-${parseInt(user.id) % 10}`,
    }));
  }, [users]);

  const { handleSubmit, register, formState } = useForm<FormFields>({
    defaultValues: {
      nodekey: '',
      user: options[0]?.value,
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn({ nodekey, user }: FormFields) {
      const queryParams = '?user=' + user + '&key=' + nodekey;
      return await fetchFn<Node>(`/api/v1/node/register${queryParams}`);
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
        <button type="button" className="btn btn-close" onClick={() => onDismiss()}>
          <i className="icon icon-close"/>
        </button>
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
                validate: value => value.startsWith('nodekey:') ? true : t('error_nodekey_format'),
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
            The device key returns the command "tailscale up --login-server https://am.itsib.su" executed on your device.
          </div>

          <div>
            {isPending ? (
              <button type="button" className="btn-primary w-full" disabled>
                <div className="jj jj-spinner"/>
              </button>
            ) : (
              <button type="submit" className="btn-primary w-full">
                <span>{t('create')}</span>
              </button>
            )}
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