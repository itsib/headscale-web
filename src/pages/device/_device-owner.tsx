import { FunctionComponent } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Select, SelectOption } from 'react-just-ui';
import { UserPhoto } from '@app-components/user-info/user-photo';
import { useUsers } from '@app-hooks/use-users.ts';
import { useTranslation } from 'react-i18next';
import { cn } from 'react-just-ui/utils/cn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFn } from '@app-utils/query-fn.ts';
import { Device } from '@app-types';
import { useNotifyQuery } from '@app-hooks/use-notify-query';
import './_device-owner.css';

export interface DeviceOwnerProps {
  deviceId: string;
  userName: string;
  className?: string;
}

export const DeviceOwner: FunctionComponent<DeviceOwnerProps> = ({ userName, className, deviceId }) => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const [value, setValue] = useState(userName);
  const { data: users } = useUsers();
  const { start, success, error } = useNotifyQuery();

  const options = useMemo(() => {
    return users?.map<SelectOption>(user => {
      return {
        value: user.name,
        label: user.name,
        icon: <UserPhoto id={user.id} pictureUrl={user.profilePicUrl} size="sm" />
      };
    })
  }, [users]);

  const { mutate } = useMutation({
    async mutationFn({ id, name }: { id: string, name: string }) {
      return await fetchFn<{ node: Device }>(`/api/v1/node/${id}/user`, {
        method: 'POST',
        body: JSON.stringify({ user: name }),
      });
    },
    onMutate: () => start(),
    onSuccess: (data) => {
      client.setQueryData([`/api/v1/node/${deviceId}`], data);
      success();
    },
    onError: (e: any) => {
      setValue(userName);
      error(e.message);
    }
  });

  function onChange(event: Event) {
    const name = (event.target as any).value;
    setValue(name);

    mutate({ name, id: deviceId });
  }

  return (
    <div className={cn('device-owner', className)}>
      <h3 className="title">{t('managed_by')}</h3>

      {options ? (
        <Select
          id="sevice-owner-selector"
          className="selector"
          label={t('device_owner')}
          hint={t('device_owner_select_hint')}
          options={options}
          value={value}
          onChange={onChange}
        />
      ) : null}
    </div>
  );
}