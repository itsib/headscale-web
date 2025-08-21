import { FunctionComponent } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Select, SelectOption } from 'react-just-ui';
import { UserPhoto } from '@app-components/user-info/user-photo';
import { useUsers } from '@app-hooks/use-users.ts';
import { useTranslation } from 'react-i18next';
import { cn } from 'react-just-ui/utils/cn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFn } from '@app-utils/query-fn.ts';
import { Device, User } from '@app-types';
import { useNotifyQuery } from '@app-hooks/use-notify-query';
import './_device-owner.css';

export interface DeviceOwnerProps {
  deviceId: string;
  user: User;
  className?: string;
}

export const DeviceOwner: FunctionComponent<DeviceOwnerProps> = ({ user, className, deviceId }) => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const [value, setValue] = useState(user.id);
  const { data: users } = useUsers();
  const { start, success, error } = useNotifyQuery();

  const options = useMemo(() => {
    if (!users) {
      return [
        {
          value: user.id,
          label: user.email || user.displayName || user.name,
          icon: <UserPhoto id={user.id} pictureUrl={user.profilePicUrl} size="sm" />,
        },
      ];
    }
    return users?.map<SelectOption>((user) => {
      return {
        value: user.id,
        label: user.email || user.displayName || user.name,
        icon: <UserPhoto id={user.id} pictureUrl={user.profilePicUrl} size="sm" />,
      };
    });
  }, [users, user]);

  const { mutate } = useMutation({
    async mutationFn({ deviceId, userId }: { deviceId: string; userId: string }) {
      return await fetchFn<{ node: Device }>(`/api/v1/node/${deviceId}/user`, {
        method: 'POST',
        body: JSON.stringify({ user: userId }),
      });
    },
    onMutate: () => start(),
    onSuccess: (data) => {
      client.setQueryData([`/api/v1/node/${deviceId}`], data);
      success();
    },
    onError: (e: any) => {
      setValue(user.id);
      error(e.message);
    },
  });

  function onChange(event: Event) {
    const userId = (event.target as any).value;
    setValue(userId);

    mutate({ userId, deviceId });
  }

  return (
    <div className={cn('device-owner', className)}>
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
};
