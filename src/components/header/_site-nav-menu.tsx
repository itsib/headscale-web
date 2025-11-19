import { cn } from 'react-just-ui/utils/cn';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { FC } from 'react';
import './_site-nav-menu.css';

export interface SiteNavMenuProps {
  layout: 'desktop' | 'mobile';
  onClick?: () => void;
}

export const SiteNavMenu: FC<SiteNavMenuProps> = ({ onClick, layout }) => {
  const { t } = useTranslation();

  return (
    <nav className={cn('site-nav-menu', layout)}>
      <Link to="/devices" className="nav-link" onClick={onClick}>
        <i className="icon icon-laptop" />
        <span className="label">{t('devices')}</span>
      </Link>
      <Link to="/users" className="nav-link" onClick={onClick}>
        <i className="icon icon-users" />
        <span className="label">{t('users')}</span>
      </Link>
      <Link to="/acl" className="nav-link" onClick={onClick}>
        <i className="icon icon-lock" />
        <span className="label">{t('access_controls')}</span>
      </Link>
      <Link to="/tokens" className="nav-link" onClick={onClick}>
        <i className="icon icon-key" />
        <span className="label">{t('tokens')}</span>
      </Link>
      <Link to="/metrics" className="nav-link" onClick={onClick}>
        <i className="icon icon-metrics" />
        <span className="label">{t('metrics')}</span>
      </Link>
    </nav>
  );
};
