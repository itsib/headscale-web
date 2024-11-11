import { FC, useMemo, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/use-theme.ts';
import { Theme } from '../../utils/theme.ts';
import { PopupPlacement } from '../popups/popup-base/_common.ts';
import { ContextMenu } from '../popups/context-menu.tsx';
import { useAppAuth } from '../../hooks/use-app-auth.ts';
import { BrandLogo } from '../brand-logo/brand-logo.tsx';
import { useAppCredentials } from '../../hooks/use-app-credentials.ts';
import './header.css';
import { useLog } from '../../hooks/use-log.ts';

export const Header: FC = () => {
  const contextRef = useRef<HTMLButtonElement | null>(null);
  const { i18n } = useTranslation();
  const [ theme, setTheme ] = useTheme();
  const [authorized,, logout] = useAppAuth();
  const { token, url } = useAppCredentials();

  useLog({ language: i18n.language })

  const prefix = useMemo(() => {
    if (!token) return undefined;
    return token.split('.')[0];
  }, [token]);

  return (
    <header className="header bg-primary dark:border-gray-800 border-b-primary">
      <div className="container flex items-center justify-between h-[60px]">
        <Link className="flex items-center text-neutral-500 dark:text-gray-300" to="/">
          <BrandLogo size={34} />
        </Link>

        {authorized ? (
          <nav className="main-menu ml-6 mr-auto">
            <NavLink to="/machines" className="nav-link">
              <i className="icon icon-connection mr-2"/>
              <Trans i18nKey="machines"/>
            </NavLink>
            <NavLink to="/users" className="nav-link">
              <i className="icon icon-users mr-2"/>
              <Trans i18nKey="users"/>
            </NavLink>
            <NavLink to="/acl" className="nav-link">
              <i className="icon icon-lock mr-2"/>
              <Trans i18nKey="access_controls"/>
            </NavLink>
            <NavLink to="/tokens" className="nav-link">
              <i className="icon icon-key mr-2"/>
              <Trans i18nKey="tokens"/>
            </NavLink>
            <NavLink to="/metrics" className="nav-link">
              <i className="icon icon-metrics mr-2"/>
              <Trans i18nKey="metrics"/>
            </NavLink>
          </nav>
        ) : null}


        {authorized ? (
          <div className="config">
            <button className="btn btn-config" ref={contextRef}>
              <i className="icon icon-settings text-[26px] leading-[26px] block"/>
            </button>

            <ContextMenu btnOpenRef={contextRef} placement={PopupPlacement.BOTTOM}>
              <div className="context-menu-item">
                <div className="px-[16px] py-[6px]">
                  <div className="text-sm text-primary font-medium">{prefix}</div>
                  <div className="text-xs text-secondary">{url}</div>
                </div>
              </div>

              <hr className="context-menu-divider"/>

              <div className="context-menu-item">
                <button type="button" className="btn-context-menu flex items-center"
                        onClick={() => setTheme(Theme.Light)}>
                  <i className="icon icon-sun"/>
                  <Trans i18nKey="light"/>

                  {theme === Theme.Light ? <i className="icon icon-check text-[11px] ml-auto"/> : null}
                </button>
              </div>
              <div className="context-menu-item">
                <button type="button" className="btn-context-menu flex items-center"
                        onClick={() => setTheme(Theme.Dark)}>
                  <i className="icon icon-moon"/>
                  <Trans i18nKey="dark"/>
                  {theme === Theme.Dark ? <i className="icon icon-check text-[11px] ml-auto"/> : null}
                </button>
              </div>
              <div className="context-menu-item">
                <button type="button" className="btn-context-menu flex items-center"
                        onClick={() => setTheme(Theme.System)}>
                  <i className="icon icon-sun-moon"/>
                  <Trans i18nKey="system"/>
                  {theme === Theme.System ? <i className="icon icon-check text-[11px] ml-auto"/> : null}
                </button>
              </div>

              <hr className="context-menu-divider"/>

              <div className="context-menu-item">
                <button type="button" className="btn-context-menu flex items-center"
                        onClick={() => i18n.changeLanguage('en')}>
                  <img className="icon" src="/locales/en/_icon.svg" alt="en-EN" width={16} height={16}/>
                  <>English</>
                  {i18n.language === 'en' ? <i className="icon icon-check text-[11px] ml-auto"/> : null}
                </button>
              </div>

              <div className="context-menu-item">
                <button type="button" className="btn-context-menu flex items-center"
                        onClick={() => i18n.changeLanguage('ru')}>
                  <img className="icon" src="/locales/ru/_icon.svg" alt="en-EN" width={16} height={16}/>
                  <>Русский</>
                  {i18n.language === 'ru' ? <i className="icon icon-check text-[11px] ml-auto"/> : null}
                </button>
              </div>

              <hr className="context-menu-divider"/>

              <div className="context-menu-item">
                <button
                  type="button"
                  className="btn-context-menu flex items-center"
                  onClick={logout}>
                  <i className="icon icon-logout"/>
                  <span><Trans i18nKey="logout"/></span>
                </button>
              </div>
            </ContextMenu>
          </div>
        ) : null}
      </div>
    </header>
  );
}