import { Trans } from 'react-i18next';
import { FC } from 'react';

export interface UserMenuProps {
  onClick: (action: 'delete' | 'rename') => void;
}

export const UserMenu: FC<UserMenuProps> = ({ onClick }) => {
  return (
    <>
      <div className="context-menu-item">
        <button type="button" className="btn-context-menu" onClick={() => onClick('rename')}>
          <Trans i18nKey="rename"/>
        </button>
      </div>
      <hr className="context-menu-divider"/>
      <div className="context-menu-item">
        <button type="button" className="btn-context-menu text-red-600"
                onClick={() => onClick('delete')}>
          <Trans i18nKey="delete"/>
        </button>
      </div>
    </>
  )
}