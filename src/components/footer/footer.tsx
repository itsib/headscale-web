import { Trans } from 'react-i18next';
import { useCredentials } from '@app-hooks/use-credentials.ts';

export function Footer() {
  const { base, prefix } = useCredentials();

  return (
    <footer className="container py-4 flex flex-col gap-3 items-center justify-start relative text-secondary sm:h-[var(--footer-height)] sm:flex-row">
      <div>
        <span><Trans i18nKey="footer_api_url" />:  </span>
        <wbr/>
        <a href={base || '#'} target="_blank" rel="noreferrer nofollow" className="text-primary">{base}</a>
      </div>
      <div className="hidden">
        <>&nbsp;&nbsp;&#128900;&nbsp;&nbsp;</>
      </div>
      <div>
        <span><Trans i18nKey="api_key_prefix" />:  </span>
        <wbr/>
        <span className="text-primary">{prefix}</span>
      </div>
    </footer>
  );
}