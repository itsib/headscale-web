import { FC, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/use-theme.ts';
import { useAppAuth } from '../../hooks/use-app-auth.ts';
import { useAppCredentials } from '../../hooks/use-app-credentials.ts';
import { Theme } from '../../utils/theme.ts';

export const HeaderMenu: FC = () => {
  const { i18n } = useTranslation();
  const [ theme, setTheme ] = useTheme();
  const [,, logout] = useAppAuth();
  const { token, url } = useAppCredentials();

  const prefix = useMemo(() => {
    if (!token) return undefined;
    return token.split('.')[0];
  }, [token]);

  return (
    <>
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
    </>
  )
}