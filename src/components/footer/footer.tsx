import { useStorage } from '@app-hooks/use-storage.ts';
import { useEffect, useState } from 'react';
import { getCredentials } from '@app-utils/credentials.ts';
import { Trans } from 'react-i18next';

export const Footer = () => {
  const storage = useStorage();
  const [baseUrl, setBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    async function refresh() {
      const { base } = await getCredentials(storage);
      setBaseUrl(base);
    }
    refresh().catch(console.error);
  }, [storage]);

  return (
    <footer className="container h-[var(--footer-height)] relative">
      <div className="h-full py-4 flex items-center justify-between">
        <div className="text-secondary">
          <Trans i18nKey="footer_api_url" components={{ a: <a href={baseUrl || '#'}>{baseUrl}</a> }} />
        </div>
      </div>
    </footer>
  );
}