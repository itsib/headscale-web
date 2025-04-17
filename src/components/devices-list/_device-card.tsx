import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { ContextMenuBase, Device, DeviceAction } from '@app-types';
import { Trans, useTranslation } from 'react-i18next';
import { FormattedDuration } from '@app-components/formatters/formatted-duration';
import { Marker } from '@app-components/marker/marker';
import { AclTag } from '@app-components/acl-tag/acl-tag';
import { ContextMenu } from './_context-menu';
import './_device-card.css';

type DeviceCardProps = ContextMenuBase<DeviceAction> & Device;

export const DeviceCard = memo(function DeviceItem(props: DeviceCardProps) {
  const { id, name, givenName, expiry, ipAddresses, forcedTags, online, user, onAction } = props;
  const { t } = useTranslation();

  const expiryDate = useMemo(() => new Date(expiry), [expiry]);
  const expiryDisabled = expiryDate.getFullYear() <= 1970;

  return (
    <a href={`/device/${id}`} className="device-card" aria-label="Open device full info">
      <div className="main-info">
        <div className="icon-wrapper">
          {online ? (
            <Marker isActive className="marker" size={16} />
          ) : null}
          <i className="icon icon-laptop"/>
        </div>

        <div className="name-expiration">
          <div className="name">{givenName || name}</div>
          <div className="expiration">
            {expiryDisabled ? (
              <Trans i18nKey="expiry_disabled"/>
            ) : (
              <FormattedDuration duration={expiryDate.getTime()}/>
            )}
          </div>
        </div>

        <ContextMenu onAction={onAction} />
      </div>

      {user.name ? (
        <div className="info-row">
          <div className="label">{t('user_login')}:</div>
          <div className="value">{user.name}</div>
        </div>
      ) : null}

      {user.displayName ? (
        <div className="info-row">
          <div className="label">{t('user_name')}:</div>
          <div className="value">{user.displayName}</div>
        </div>
      ) : null}

      <div className="info-row">
        <div className="label">{t('ip_addresses')}:</div>
        <div className="value">
          {ipAddresses.map(ip => (<div key={ip}>{ip}</div>))}
        </div>
      </div>

      {forcedTags.length ? (
        <div className="tags">
          {forcedTags.map(tag => <AclTag key={tag} tag={tag}/>)}
        </div>
      ) : null}
    </a>
  );
});