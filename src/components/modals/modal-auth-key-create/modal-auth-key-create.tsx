import { useMemo, useState } from 'preact/hooks';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input, Select, SelectOption, Switch } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchFn } from '@app-utils/query-fn.ts';
import { useUsers } from '@app-hooks/use-users.ts';
import { AuthKey } from '@app-types';
import { BtnCopy } from '../../btn-copy/btn-copy.tsx';
import { FormattedDate } from '../../formatters/formatted-date.tsx';
import { FunctionComponent } from 'preact';
import { UserPhoto } from '@app-components/user-info/user-photo.tsx';

interface FormFields {
  user: string;
  reusable: boolean;
  ephemeral: boolean;
  expiration: number;
  aclTags: string[];
}

export interface ModalAuthKeyCreateProps extends ModalProps {
  onSuccess: () => void;
}

export const ModalAuthKeyCreate: FunctionComponent<ModalAuthKeyCreateProps> = ({ isOpen, onDismiss, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent onDismiss={onDismiss} {...props} />
    </Modal>
  );
};

const ModalContent: FunctionComponent<Omit<ModalAuthKeyCreateProps, 'isOpen'>> = ({ onDismiss, onSuccess }) => {
  const { t } = useTranslation();
  const { data: users } = useUsers();
  const [newAuthKey, setNewAuthKey] = useState<AuthKey | undefined>();

  const options: SelectOption[] = useMemo(() => {
    if (!users) {
      return [];
    }
    return users.map(user => ({
      value: user.id,
      label: user.email || user.displayName || user.name,
      icon: <UserPhoto id={user.id} pictureUrl={user.profilePicUrl} size="sm" />
    }));
  }, [users]);

  const { handleSubmit, register, formState } = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: {
      user: options[0]?.value,
      reusable: false,
      ephemeral: false,
      expiration: 90,
      aclTags: [],
    },
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn(values: Omit<AuthKey, 'createdAt' | 'used' | 'id' | 'key'>) {
      return await fetchFn<{ preAuthKey: AuthKey }>(`/api/v1/preauthkey`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
    },
    onSuccess: (result) => {
      setNewAuthKey(result.preAuthKey);
    },
  });

  function onSubmit(values: FormFields) {
    const expiration = new Date(Date.now() + (values.expiration * 24 * 60 * 60 * 1000));
    mutate({
      user: values.user,
      reusable: values.reusable,
      ephemeral: values.ephemeral,
      expiration: expiration.toISOString(),
      aclTags: [],
    });
  }

  return (
    <div className="modal w-[400px]">
      <div className="modal-header">
        <div className="title">
          {newAuthKey ? (
            <span>{t('generated_new_auth_key')}</span>
          ) : (
            <span>{t('generate_auth_key_modal')}</span>
          )}
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()}/>
      </div>
      <div className="modal-content">
        {newAuthKey ? (
          <div>
            <div className="text-secondary text-sm font-normal">
              <Trans i18nKey="auth_key_created_about_copy"/>
            </div>

            <div className="border-secondary border rounded-md px-3 py-2 my-4 flex">
              <input className="w-full outline-none" readOnly value={newAuthKey.key}/>

              <BtnCopy className="p-0 ml-4" text={newAuthKey.key}/>
            </div>

            <div className="text-secondary text-sm font-normal">
              <Trans
                i18nKey="auth_key_created_about_expiry"
                components={{
                  date:  <FormattedDate date={newAuthKey.expiration} />,
                }}
              />
            </div>

            <button type="button" className="btn btn-accent w-full mt-6" onClick={() => {
              onSuccess?.();
              onDismiss?.();

              setTimeout(() => {
                setNewAuthKey(undefined);
              }, 300);
            }}>
              <span>{t('done')}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <Select
                id="key-user-selector"
                label={
                  <>
                    <div className="text-base font-semibold">{t('auth_key_user_title')}</div>
                    <div className="text-secondary text-xs">{t('auth_key_user_hint')}</div>
                  </>
                }
                options={options}
                error={errors?.user}
                {...register('user', {
                  required: t('error_required'),
                })}
              />
            </div>
            <div className="mb-2">
              <Switch
                id="key-reusable"
                label={
                  <>
                    <div className="text-base font-semibold">{t('reusable')}</div>
                    <div className="text-secondary text-xs">{t('auth_key_reusable_hint')}</div>
                  </>
                }
                rowReverse
                className="w-full justify-between"
                {...register('reusable')}
              />
            </div>
            <div className="mb-2">
              <Input
                id="key-expiration"
                type="number"
                label={
                  <>
                    <div className="text-base font-semibold">{t('auth_key_expiration_title')}</div>
                    <div className="text-secondary text-xs">{t('auth_key_expiration_hint')}</div>
                  </>
                }
                suffix={t('days')}
                error={errors?.expiration}
                {...register('expiration', {
                  required: t('error_required'),
                  min: {
                    value: 1,
                    message: t('error_expiry_min', { value: 1 }),
                  },
                  max: {
                    value: 90,
                    message: t('error_expiry_max', { value: 90 }),
                  },
                  // valueAsNumber: true,
                })}
              />
            </div>
            <hr className="border-t-secondary mb-4"/>
            <div className="mb-2">
              <Switch
                id="key-ephemeral"
                label={
                  <>
                    <div className="text-base font-semibold">{t('auth_key_ephemeral_title')}</div>
                    <div
                      className="text-secondary text-xs break-words max-w-[300px]">{t('auth_key_ephemeral_hint')}</div>
                  </>
                }
                rowReverse
                className="w-full justify-between"
                {...register('ephemeral')}
              />
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
        )}

      </div>
    </div>
  );
};