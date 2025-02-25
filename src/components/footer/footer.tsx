import { useTranslation } from 'react-i18next';
import { useCredentials } from '@app-hooks/use-credentials.ts';

export const Footer = () => {
  const { t } = useTranslation();
  const { base: baseUrl } = useCredentials();

  return (
    <footer className="container h-[var(--footer-height)] relative">
      <div className="h-full py-4 flex items-center justify-between">
        <div className="text-secondary">
          <span>{t('footer_api_url')}:&nbsp;</span>
          <a href={baseUrl || '#'}>{baseUrl}</a>
        </div>
      </div>
    </footer>
  );
}