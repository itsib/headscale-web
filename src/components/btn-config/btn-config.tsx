import type { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from '@app-hooks/use-theme';
import { useCredentials } from '@app-hooks/use-credentials';
import { BtnContextMenu, PopupPlacement } from '@app-components/btn-context-menu';
import './btn-config.css';

export const BtnConfig: FC = () => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useTheme();
  const { logout } = useCredentials();

  return (
    <div className="btn-config-wrapper">
      <BtnContextMenu placement={PopupPlacement.BOTTOM} icon="icon-settings">
        <div className="context-menu-item">
          <button
            aria-label="Choose the light theme"
            role="menuitem"
            type="button"
            className="btn-context-menu flex items-center"
            onClick={() => setTheme('light')}
          >
            <i className="icon icon-sun" />
            <Trans i18nKey="light" />

            {theme === 'light' ? <i className="icon icon-check text-[11px] ml-auto" /> : null}
          </button>
        </div>
        <div className="context-menu-item">
          <button
            aria-label="Choose the dark theme"
            role="menuitem"
            type="button"
            className="btn-context-menu flex items-center"
            onClick={() => setTheme('dark')}
          >
            <i className="icon icon-moon" />
            <Trans i18nKey="dark" />
            {theme === 'dark' ? <i className="icon icon-check text-[11px] ml-auto" /> : null}
          </button>
        </div>
        <div className="context-menu-item">
          <button
            aria-label="Choose the system theme"
            role="menuitem"
            type="button"
            className="btn-context-menu flex items-center"
            onClick={() => setTheme('system')}
          >
            <i className="icon icon-sun-moon" />
            <Trans i18nKey="system" />
            {theme === 'system' ? <i className="icon icon-check text-[11px] ml-auto" /> : null}
          </button>
        </div>

        <hr className="context-menu-divider" />

        <div className="context-menu-item">
          <button
            aria-label="Choose English"
            role="menuitem"
            type="button"
            className="btn-context-menu flex items-center"
            onClick={() => i18n.changeLanguage('en')}
          >
            <img className="icon" src="/locales/en/_icon.svg" alt="en-EN" width={16} height={16} />
            <>English</>
            {i18n.language === 'en' ? <i className="icon icon-check text-[11px] ml-auto" /> : null}
          </button>
        </div>

        <div className="context-menu-item">
          <button
            aria-label="Choose Russian"
            role="menuitem"
            type="button"
            className="btn-context-menu flex items-center"
            onClick={() => i18n.changeLanguage('ru')}
          >
            <img className="icon" src="/locales/ru/_icon.svg" alt="en-EN" width={16} height={16} />
            <>Русский</>
            {i18n.language === 'ru' ? <i className="icon icon-check text-[11px] ml-auto" /> : null}
          </button>
        </div>

        <hr role="separator" className="context-menu-divider" />

        <div className="context-menu-item">
          <button
            aria-label="Logout"
            role="menuitem"
            type="button"
            className="btn-context-menu flex items-center"
            onClick={logout}
          >
            <i className="icon icon-logout" />
            <span>
              <Trans i18nKey="disconnect" />
            </span>
          </button>
        </div>
      </BtnContextMenu>
    </div>
  );
};
