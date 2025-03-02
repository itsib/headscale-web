import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from '@app-hooks/use-theme';
import { Theme } from '@app-utils/theme';
import { useCredentials } from '@app-hooks/use-credentials.ts';
import { FunctionComponent } from 'preact';

export const HeaderMenu: FunctionComponent = () => {
  const { i18n } = useTranslation();
  const [ theme, setTheme ] = useTheme();
  const { logout, prefix, base: baseUrl } = useCredentials();

  return (
    <>
      <div className="context-menu-item">
        <div className="px-[16px] py-[6px]">
          <div className="text-sm text-primary font-medium cursor-pointer">
            <span>{prefix}</span>
          </div>
          <div className="text-xs text-secondary">{baseUrl}</div>
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
          <span><Trans i18nKey="disconnect"/></span>
        </button>
      </div>
    </>
  )

}