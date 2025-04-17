import { Device, ContextMenuBase, DeviceAction } from '@app-types';
import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { Trans } from 'react-i18next';
import { useLocation } from 'preact-iso';
import { FormattedDuration } from '@app-components/formatters/formatted-duration';
import { UserInfo } from '@app-components/user-info/user-info';
import { AclTag } from '@app-components/acl-tag/acl-tag';
import { IpAddresses } from '@app-components/ip-addresses/ip-addresses';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { Marker } from '@app-components/marker/marker';
import { ContextMenu } from './_context-menu';
import './_device-table-row.css';
import { DeviceIcon } from '@app-components/icons/device-icon.tsx';

type DeviceTableRowProps = ContextMenuBase<DeviceAction> & Device;

export const DeviceTableRow = memo(function DeviceTableRow(props: DeviceTableRowProps) {
  const { id, name, givenName, expiry, ipAddresses, forcedTags, lastSeen, online, user, onAction } = props;
  const { route } = useLocation();

  const expiryDate = useMemo(() => new Date(expiry), [expiry]);
  const expiryDisabled = expiryDate.getFullYear() <= 1970;

  return (
    <tr
      className="device-table-row"
      data-href={`/device/${id}`}
      role="link"
      tabindex={0}
      aria-label="Open device full info"
      onClick={() => route(`/device/${id}`)}
      onKeyDown={() => route(`/device/${id}`)}
    >
      <td>
        <DeviceIcon type="laptop" size={36}/>
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
              <FormattedDuration duration={expiryDate.getTime()}/>
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
        <Marker className="mr-3 mb-[1px]" isActive={online}/>
        <FormattedDate date={lastSeen}/>
      </td>
      <td>
        <ContextMenu onAction={onAction}/>
      </td>
    </tr>
  );
});