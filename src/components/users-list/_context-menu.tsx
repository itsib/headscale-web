import { Trans } from 'react-i18next';
import { memo } from 'preact/compat';
import { ContextMenuBase, UserAction } from '@app-types';
import { BtnContextMenu, PopupPlacement } from '@app-components/btn-context-menu';

export const ContextMenu = memo(function ContextMenu({ onAction }: ContextMenuBase<UserAction>) {
  return (
    <BtnContextMenu placement={PopupPlacement.BOTTOM}>
      <div className="context-menu-item">
        <button role="menuitem" aria-label="Rename user" type="button" className="btn-context-menu" onClick={() => onAction('rename')}>
          <Trans i18nKey="rename"/>
        </button>
      </div>
      <hr className="context-menu-divider"/>
      <div className="context-menu-item">
        <button role="menuitem" aria-label="Delete user" type="button" className="btn-context-menu text-error" onClick={() => onAction('delete')}>
          <Trans i18nKey="delete"/>
        </button>
      </div>
    </BtnContextMenu>
  )
});
