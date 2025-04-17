import { AuthKeys } from './-auth-keys.tsx';
import { ApiTokens } from './-api-tokens.tsx';
import { PageCaption } from '@app-components/page-caption/page-caption.tsx';

export function Tokens() {
  return (
    <div className="page">
      <PageCaption
        title="keys_and_tokens"
        subtitle="api_key_subtitle"
      />

      <div className="pt-6">
        <AuthKeys />
      </div>
      <div className="pt-10">
        <ApiTokens />
      </div>
    </div>
  );
}
