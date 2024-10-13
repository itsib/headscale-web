import { FC, useMemo, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useTheme } from '../../hooks/use-theme.ts';
import { Theme } from '../../utils/theme.ts';
import './header.css';
import { PopupPlacement } from '../popups/popup-base/_common.ts';
import { ContextMenu } from '../popups/context-menu.tsx';
import { useLogout } from '../../hooks/use-logout.ts';
import { useAuthorized } from '../../hooks/use-authorized.ts';

export const Header: FC = () => {
  const contextRef = useRef<HTMLButtonElement | null>(null);
  const [ theme, setTheme ] = useTheme();
  const logout = useLogout();
  const navigate = useNavigate();
  const authorized = useAuthorized();

  const prefix = useMemo(() => {
    const token = localStorage.getItem('headscale.token');
    if (!token) return undefined;
    return token.split('.')[0];
  }, []);

  const url = useMemo(() => {
    return localStorage.getItem('headscale.url');
  }, []);

  return (
    <header className="header bg-primary dark:border-gray-800 border-b-primary">
      <div className="container flex items-center justify-between h-[60px]">
        <Link className="flex items-center" to="/">
          <svg width={24} height={24} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"
               className="-top-[1px] relative">
            <circle opacity="0.2" cx="3.4" cy="3.25" r="2.7" fill="currentColor"/>
            <circle cx="3.4" cy="11.3" r="2.7" fill="currentColor"/>
            <circle opacity="0.2" cx="3.4" cy="19.5" r="2.7" fill="currentColor"/>
            <circle cx="11.5" cy="11.3" r="2.7" fill="currentColor"/>
            <circle cx="11.5" cy="19.5" r="2.7" fill="currentColor"/>
            <circle opacity="0.2" cx="11.5" cy="3.25" r="2.7" fill="currentColor"/>
            <circle opacity="0.2" cx="19.5" cy="3.25" r="2.7" fill="currentColor"/>
            <circle cx="19.5" cy="11.3" r="2.7" fill="currentColor"/>
            <circle opacity="0.2" cx="19.5" cy="19.5" r="2.7" fill="currentColor"/>
          </svg>
        </Link>

        <nav className="main-menu ml-6 mr-auto">
          <NavLink to="/machines" className="nav-link">
            <i className="icon icon-connection mr-2"/>
            <Trans i18nKey="machines"/>
          </NavLink>
          <NavLink to="/users" className="nav-link">
            <i className="icon icon-users mr-2" />
            <Trans i18nKey="users"/>
          </NavLink>
          <NavLink to="/acl" className="nav-link">
            <i className="icon icon-lock mr-2" />
            <Trans i18nKey="access_controls"/>
          </NavLink>
          <NavLink to="/tokens" className="nav-link">
            <i className="icon icon-key mr-2" />
            <Trans i18nKey="tokens"/>
          </NavLink>
        </nav>

        {authorized ? (
          <div className="flex items-center gap-4">
            <button
              className="text-primary dark:text-opacity-80 text-opacity-70 hover:text-primary transition"
              ref={contextRef}
            >
              <i className="icon icon-profile text-[30px] leading-[30px] block"/>
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
                <button type="button" className="btn-context-menu flex items-center" onClick={() => setTheme(Theme.Light)}>
                  <i className="icon icon-sun"/>
                  <Trans i18nKey="light"/>

                  {theme === Theme.Light ? <i className="icon icon-check text-[11px] ml-auto" /> : null }
                </button>
              </div>
              <div className="context-menu-item">
                <button type="button" className="btn-context-menu flex items-center" onClick={() => setTheme(Theme.Dark)}>
                  <i className="icon icon-moon"/>
                  <Trans i18nKey="dark"/>
                  {theme === Theme.Dark ? <i className="icon icon-check text-[11px] ml-auto" /> : null }
                </button>
              </div>
              <div className="context-menu-item">
                <button type="button" className="btn-context-menu flex items-center" onClick={() => setTheme(Theme.System)}>
                  <i className="icon icon-sun-moon"/>
                  <Trans i18nKey="system"/>
                  {theme === Theme.System ? <i className="icon icon-check text-[11px] ml-auto" /> : null }
                </button>
              </div>

              <hr className="context-menu-divider"/>

              <div className="context-menu-item">
                <button
                  type="button"
                  className="btn-context-menu flex items-center"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}>
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