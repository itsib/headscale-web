import { Device } from '@app-types';
import { memo } from 'react';
import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { FormattedDuration } from '@app-components/formatters/formatted-duration';
import { UserInfo } from '@app-components/user-info/user-info';
import { AclTag } from '@app-components/acl-tag/acl-tag';
import { IpAddresses } from '@app-components/ip-addresses/ip-addresses';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { Marker } from '@app-components/marker/marker';
import { DeviceIcon } from '@app-components/icons/device-icon.tsx';
import './_device-table-row.css';

export const DeviceTableRow = memo(function DeviceTableRow(props: Device) {
  const { id, name, givenName, expiry, ipAddresses, forcedTags, lastSeen, online, user } = props;
  const navigate = useNavigate();

  const expiryDate = useMemo(() => new Date(expiry), [expiry]);
  const expiryDisabled = expiryDate.getFullYear() <= 1970;

  return (
    <tr
      className="device-table-row"
      data-href={`/device/${id}`}
      role="link"
      tabIndex={0}
      aria-label="Open device full info"
      onClick={() => navigate({ to: `/devices/$deviceId`, params: { deviceId: id } })}
    >
      <td>
        <DeviceIcon type="laptop" size={36} />
      </td>
      <td>
        <div className="text-primary font-medium text-lg">{givenName || name}</div>
        <div className="flex justify-start">
          {expiryDisabled ? (
            <div className="text-secondary text-xs font-normal">
              <Trans i18nKey="expiry_disabled" />
            </div>
          ) : (
            <div className="text-secondary text-xs font-normal">
              <FormattedDuration duration={expiryDate.getTime()} />
            </div>
          )}
        </div>
      </td>
      <td>
        <UserInfo
          id={user.id}
          name={user.name}
          email={user.email}
          displayName={user.displayName}
          pictureUrl={user.profilePicUrl}
        />
      </td>
      <td>
        {forcedTags.length ? (
          <div className="flex justify-center flex-wrap">
            {forcedTags.map((tag) => (
              <AclTag key={tag} tag={tag} />
            ))}
          </div>
        ) : (
          <>-</>
        )}
      </td>
      <td onMouseDown={(e) => e.stopPropagation()}>
        <IpAddresses addresses={ipAddresses} />
      </td>
      <td>
        <Marker className="mr-3 mb-[1px]" isActive={online} />
        <FormattedDate date={lastSeen} />
      </td>
    </tr>
  );
});
