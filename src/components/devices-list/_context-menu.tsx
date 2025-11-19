import { memo } from 'react';
import { ContextMenuBase, DeviceAction } from '@app-types';
import { Trans } from 'react-i18next';
import { BtnContextMenu, PopupPlacement } from '@app-components/btn-context-menu';

export const ContextMenu = memo(function ContextMenu({ onAction }: ContextMenuBase<DeviceAction>) {
  return (
    <BtnContextMenu placement={PopupPlacement.BOTTOM}>
      <div className="context-menu-item">
        <button
          role="menuitem"
          aria-label="Rename device"
          type="button"
          className="btn-context-menu"
          onClick={() => onAction('rename')}
        >
          <Trans i18nKey="rename" />
        </button>
      </div>
      <div className="context-menu-item">
        <button
          role="menuitem"
          aria-label="Change device owner"
          type="button"
          className="btn-context-menu"
          onClick={() => onAction('chown')}
        >
          <Trans i18nKey="change_owner" />
        </button>
      </div>
      <div className="context-menu-item">
        <button
          role="menuitem"
          aria-label="Key expiration"
          type="button"
          className="btn-context-menu"
          onClick={() => onAction('expiry')}
        >
          <Trans i18nKey="expire_key" />
        </button>
      </div>
      <hr role="separator" className="context-menu-divider" />
      <div className="context-menu-item">
        <button
          role="menuitem"
          aria-label="Edit routes"
          type="button"
          className="btn-context-menu"
          onClick={() => onAction('routes')}
        >
          <Trans i18nKey="edit_route_settings" />
        </button>
      </div>
      <div className="context-menu-item">
        <button
          role="menuitem"
          aria-label="Edit ACL tags"
          type="button"
          className="btn-context-menu"
          onClick={() => onAction('tags')}
        >
          <Trans i18nKey="edit_acl_tags" />
        </button>
      </div>
      <hr role="separator" className="context-menu-divider" />
      <div className="context-menu-item">
        <button
          role="menuitem"
          aria-label="Delete device"
          type="button"
          className="btn-context-menu text-error"
          onClick={() => onAction('delete')}
        >
          <Trans i18nKey="delete" />
        </button>
      </div>
    </BtnContextMenu>
  );
});
