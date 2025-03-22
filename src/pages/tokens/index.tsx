import { Trans } from 'react-i18next';
import { AuthKeys } from './-auth-keys.tsx';
import { ApiTokens } from './-api-tokens.tsx';

export function Tokens() {
  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="keys_and_tokens" />
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="api_key_subtitle" />
          </p>
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
