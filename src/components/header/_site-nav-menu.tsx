import { cn } from 'react-just-ui/utils/cn';
import { useLocation } from 'preact-iso/router';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'preact';
import './_site-nav-menu.css';

export interface SiteNavMenuProps {
  layout: 'desktop' | 'mobile';
  onClick?: () => void;
}

export const SiteNavMenu: FunctionComponent<SiteNavMenuProps> = ({ onClick, layout }) => {
  const { t } = useTranslation();
  const { path } = useLocation();

  return (
    <nav className={cn('site-nav-menu', layout)}>
      <a
        href="/devices"
        className={cn('nav-link', { active: path.startsWith('/device') })}
        onClick={onClick}
      >
        <i className="icon icon-laptop" />
        <span className="label">{t('devices')}</span>
      </a>
      <a
        href="/users"
        className={cn('nav-link', { active: path.startsWith('/user') })}
        onClick={onClick}
      >
        <i className="icon icon-users" />
        <span className="label">{t('users')}</span>
      </a>
      <a
        href="/acl"
        className={cn('nav-link', { active: path.startsWith('/acl') })}
        onClick={onClick}
      >
        <i className="icon icon-lock" />
        <span className="label">{t('access_controls')}</span>
      </a>
      <a
        href="/tokens"
        className={cn('nav-link', { active: path.startsWith('/tokens') })}
        onClick={onClick}
      >
        <i className="icon icon-key" />
        <span className="label">{t('tokens')}</span>
      </a>
      <a
        href="/metrics"
        className={cn('nav-link', { active: path.startsWith('/metrics') })}
        onClick={onClick}
      >
        <i className="icon icon-metrics" />
        <span className="label">{t('metrics')}</span>
      </a>
    </nav>
  );
};
