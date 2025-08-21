import { memo, useMemo } from 'react';
import { ApiToken } from '@app-types';
import { Trans } from 'react-i18next';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { FormattedDuration } from '@app-components/formatters/formatted-duration';
import { BtnContextMenu, PopupPlacement } from '@app-components/btn-context-menu';
import './_api-token-item.css';

export type ContextAction = 'expire' | 'delete' | 'create';

export interface ApiTokenItemProps extends ApiToken {
  onAction: (action: ContextAction) => void;
}

export const _apiTokenItem = memo(function ApiTokenItem(props: ApiTokenItemProps) {
  const { prefix, createdAt, expiration, lastSeen, onAction } = props;

  const isExpired = useMemo(
    () => !!expiration && new Date(expiration).getTime() - Date.now() < 0,
    [expiration]
  );

  return (
    <tr className="api-token-item">
      <td className="cell-0">
        <div className="logo">
          <i className="icon icon-keys" />
        </div>
      </td>
      <td className="">
        <div>{prefix}</div>
      </td>
      <td className="text-left">
        <div className="text-sm text-secondary">
          <FormattedDate date={createdAt} />
        </div>
      </td>
      <td className="text-left">
        <div className="text-sm text-secondary">
          <FormattedDate date={expiration} />
        </div>
        {isExpired ? (
          <div className="text-sm text-danger">
            <Trans i18nKey="expired" />
          </div>
        ) : (
          <div className="text-sm text-secondary">
            <FormattedDuration duration={expiration} />
          </div>
        )}
      </td>
      <td className="text-right">
        {lastSeen ? <FormattedDate date={expiration} /> : <div>-</div>}
      </td>
      <td className="text-right" style="width: 52px;">
        <BtnContextMenu placement={PopupPlacement.BOTTOM}>
          <div className="context-menu-item">
            <button type="button" className="btn-context-menu" onClick={() => onAction('expire')}>
              <Trans i18nKey="expire" />
            </button>
          </div>

          <hr className="context-menu-divider" />

          <div className="context-menu-item" onClick={() => onAction('delete')}>
            <button type="button" className="btn-context-menu text-danger">
              <Trans i18nKey="delete" />
            </button>
          </div>
        </BtnContextMenu>
      </td>
    </tr>
  );
});
