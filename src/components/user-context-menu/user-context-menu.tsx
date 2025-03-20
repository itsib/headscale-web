import { Trans } from 'react-i18next';
import { memo } from 'preact/compat';
import { ContextMenuBase, UserAction } from '@app-types';
import { PopupPlacement } from '@app-components/popups/base-popup/base-popup';
import { ContextMenu } from '@app-components/popups/context-menu';

export const UsersContextMenu = memo(function UsersContextMenu({ onAction }: ContextMenuBase<UserAction>) {
  return (
    <ContextMenu placement={PopupPlacement.BOTTOM}>
      <div className="context-menu-item">
        <button role="menuitem" aria-label="Rename user" type="button" className="btn-context-menu" onClick={() => onAction('rename')}>
          <Trans i18nKey="rename"/>
        </button>
      </div>
      <hr className="context-menu-divider"/>
      <div className="context-menu-item">
        <button role="menuitem" aria-label="Delete user" type="button" className="btn-context-menu text-red-600" onClick={() => onAction('delete')}>
          <Trans i18nKey="delete"/>
        </button>
      </div>
    </ContextMenu>
  )
});
