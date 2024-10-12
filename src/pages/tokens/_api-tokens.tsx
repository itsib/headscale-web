import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ApiTokenItem, ContextAction } from './_api-token-item.tsx';
import { AuthKey } from '../../types';
import { useApiTokens } from '../../hooks/use-api-tokens.ts';

export const ApiTokens: FC = () => {
  const { t } = useTranslation();
  const { data: apiTokens } = useApiTokens();

  const [, setOpened] = useState<ContextAction | null>(null);
  const [selected, setSelected] = useState<AuthKey | null>(null);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="mb-2"><Trans i18nKey="api_access_tokens"/></h2>
          <p className="text-secondary"><Trans i18nKey="api_access_tokens_subtitle"/></p>
        </div>

        <button type="button" className="btn btn-primary flex items-center gap-2">
          <i className="icon icon-key-plus text-lg"/>
          <span className="font-semibold">
            <Trans i18nKey="generate_access_token"/>
          </span>
        </button>
      </div>
      {apiTokens?.length ? (
        <table className="w-full table-auto border-spacing-px" border={1}>
          <thead>
          <tr className="border-b border-b-primary h-[50px] text-sm font-semibold text-secondary uppercase">
            <th/>
            <th className="text-left ">{t('key_id')}</th>
            <th className="text-left">{t('created')}</th>
            <th className="text-left">{t('expiry')}</th>
            <th className="text-right">{t('last_seen')}</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {apiTokens?.map(authKey => (
            <ApiTokenItem
              key={authKey.id}
              onAction={action => {
                setSelected(selected);
                setOpened(action);
              }}
              {...authKey} />
          ))}
          </tbody>
        </table>
      ) : (
        <div className="border-primary border rounded-md p-8 text-center">
          <Trans i18nKey="no_api_tokens" />
        </div>
      )}
    </>
  );
}