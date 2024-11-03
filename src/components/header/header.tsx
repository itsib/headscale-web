import { FC, useMemo, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useTheme } from '../../hooks/use-theme.ts';
import { Theme } from '../../utils/theme.ts';
import { PopupPlacement } from '../popups/popup-base/_common.ts';
import { ContextMenu } from '../popups/context-menu.tsx';
import { useLogout } from '../../hooks/use-logout.ts';
import { useAuthorized } from '../../hooks/use-authorized.ts';
import { BrandLogo } from '../brand-logo/brand-logo.tsx';
import './header.css';

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