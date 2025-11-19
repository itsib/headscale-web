import { AuthKeys } from './-auth-keys.tsx';
import { ApiTokens } from './-api-tokens.tsx';
import { PageCaption } from '@app-components/page-caption/page-caption.tsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tokens/')({
  component: RouteComponent,
});

export function RouteComponent() {
  return (
    <div className="page">
      <PageCaption title="keys_and_tokens" subtitle="api_key_subtitle" />

      <div className="">
        <AuthKeys />
      </div>
      <div className="pt-10">
        <ApiTokens />
      </div>
    </div>
  );
}
