import { Trans } from 'react-i18next';
import { FC } from 'react';

export type ContextAction = 'delete' | 'create' | 'rename' | 'chown' | 'expiry' | 'tags' | 'routes';

export interface MachineMenuProps {
  onAction: (name: ContextAction) => void;
}

export const MachineMenu: FC<MachineMenuProps> = ({ onAction }) => {
  return (
    <>
      <div className="context-menu-item">
        <button type="button" className="btn-context-menu" onClick={() => onAction('rename')}>
          <Trans i18nKey="rename"/>
        </button>
      </div>
      <div className="context-menu-item">
        <button type="button" className="btn-context-menu" onClick={() => onAction('chown')}>
          <Trans i18nKey="change_owner"/>
        </button>
      </div>
      <div className="context-menu-item" onClick={() => onAction('expiry')}>
        <button type="button" className="btn-context-menu">
          <Trans i18nKey="expire_key"/>
        </button>
      </div>

      <hr className="context-menu-divider"/>

      <div className="context-menu-item" onClick={() => onAction('routes')}>
        <button type="button" className="btn-context-menu">
          <Trans i18nKey="edit_route_settings"/>
        </button>
      </div>

      <div className="context-menu-item" onClick={() => onAction('tags')}>
        <button type="button" className="btn-context-menu">
          <Trans i18nKey="edit_acl_tags"/>
        </button>
      </div>

      <hr className="context-menu-divider"/>

      <div className="context-menu-item" onClick={() => onAction('delete')}>
        <button type="button" className="btn-context-menu text-red-600">
          <Trans i18nKey="delete"/>
        </button>
      </div>
    </>
  );
}