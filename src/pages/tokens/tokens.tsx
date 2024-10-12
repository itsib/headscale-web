import { FC } from 'react';
import { Trans } from 'react-i18next';
import { ApiTokens } from './_api-tokens.tsx';
import { AuthKeys } from './_auth-keys.tsx';

export const TokensPage: FC = () => {
  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2"><Trans i18nKey="api_key"/></h1>
          <p className="text-secondary"><Trans i18nKey="api_key_subtitle"/></p>
        </div>
      </div>
      <div className="pt-6">
        <AuthKeys />
      </div>
      <div className="pt-10">
        <ApiTokens />
      </div>
    </div>
  );
}