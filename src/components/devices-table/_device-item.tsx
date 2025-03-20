import { Device, ContextMenuBase, DeviceAction } from '@app-types';
import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { Trans } from 'react-i18next';
import { FormattedDuration } from '@app-components/formatters/formatted-duration';
import { UserInfo } from '@app-components/user-info/user-info';
import { AclTag } from '@app-components/acl-tag/acl-tag';
import { IpAddresses } from '@app-components/ip-addresses/ip-addresses';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { Marker } from '@app-components/marker/marker';
import { DeviceContextMenu } from '@app-components/device-context-menu/device-context-menu';
import './_device-item.css';

type DeviceItemProps = ContextMenuBase<DeviceAction> & Device;

export const DeviceItem = memo(function NodeRow(props: DeviceItemProps) {
  const { name, givenName, expiry, ipAddresses, forcedTags, lastSeen, online, user, onAction } = props;

  const expiryDate = useMemo(() => new Date(expiry), [expiry]);
  const expiryDisabled = expiryDate.getFullYear() <= 1970;

  return (
    <tr className="device-item-row">
      <td>
        <div className="w-[36px] h-[36px] rounded-full bg-accent text-center text-white">
          <i className="icon icon-laptop text-[18px] leading-[36px]"/>
        </div>
      </td>
      <td>
        <div className="text-primary font-medium text-lg">{givenName || name}</div>
        <div className="flex justify-start">
          {expiryDisabled ? (
            <div className="text-secondary text-xs font-normal">
              <Trans i18nKey="expiry_disabled"/>
            </div>
          ) : (
            <div className="text-secondary text-xs font-normal">
              <FormattedDuration timestamp={expiryDate.getTime()}/>
            </div>
          )}
        </div>
      </td>
      <td>
        <UserInfo
          id={user.id}
          name={user.name}
          displayName={user.displayName}
          pictureUrl={user.profilePicUrl}
          size={30}
        />
      </td>
      <td>
        {forcedTags.length ? (
          <div className="flex justify-center flex-wrap">
            {forcedTags.map(tag => <AclTag key={tag} tag={tag}/>)}
          </div>
        ) : <>-</>}
      </td>
      <td>
        <IpAddresses addresses={ipAddresses}/>
      </td>
      <td>
        <Marker className="mr-3 mb-[1px]" isActive={online} />
        <FormattedDate iso={lastSeen} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
      </td>
      <td>
        <DeviceContextMenu onAction={onAction} />
      </td>
    </tr>
  );
});