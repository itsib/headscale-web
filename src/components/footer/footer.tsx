import { useTranslation } from 'react-i18next';
import { useCredentials } from '@app-hooks/use-credentials.ts';

export const Footer = () => {
  const { t } = useTranslation();
  const { base: baseUrl } = useCredentials();

  return baseUrl ? (
    <footer className="container h-[var(--footer-height)] relative text-secondary text-start pt-4">
      <span>{t('footer_api_url')}:  </span>
      <wbr/>
      <a href={baseUrl || '#'} target="_blank" rel="noreferrer nofollow">{baseUrl}</a>
    </footer>
  ) : null;
}