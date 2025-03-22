import { memo, useMemo } from 'react';
import { ApiToken } from '@app-types';
import { Trans } from 'react-i18next';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { FormattedDuration } from '@app-components/formatters/formatted-duration';
import { BtnContextMenu, PopupPlacement } from '@app-components/btn-context-menu';

export type ContextAction = 'expire' | 'delete' | 'create';

export interface ApiTokenItemProps extends ApiToken {
  onAction: (action: ContextAction) => void;
}

export const ApiTokenItem = memo(function ApiTokenItem(props: ApiTokenItemProps) {
  const { prefix, createdAt, expiration, lastSeen, onAction } = props;

  const isExpired = useMemo(() => !!expiration && (new Date(expiration).getTime() - Date.now()) < 0, [expiration]);

  return (
    <tr className="h-[60px] border-b border-b-primary">
      <td className="w-[60px]">
        <div className="w-[36px] h-[36px] rounded-full bg-green-700 bg-opacity-70 text-center">
          <i className="icon icon-keys text-[18px] leading-[36px] text-white"/>
        </div>
      </td>
      <td className="">
        <div>{prefix}</div>
      </td>
      <td className="text-left">
        <div className="text-sm text-secondary">
          <FormattedDate iso={createdAt} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
        </div>
      </td>
      <td className="text-left">
        <div className="text-sm text-secondary">
          <FormattedDate iso={expiration} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
        </div>
        {isExpired ? (
          <div className="text-sm text-red-500">
            <Trans i18nKey="expired" />
          </div>
        ) : (
          <div className="text-sm text-secondary">
            <FormattedDuration iso={expiration} format="long"/>
          </div>
        )}
      </td>
      <td className="text-right">
        {lastSeen ? (
          <FormattedDate iso={expiration} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
        ) : (
          <div>-</div>
        )}
      </td>
      <td className="text-right w-[52px]">
        <BtnContextMenu placement={PopupPlacement.BOTTOM}>
          <div className="context-menu-item">
            <button type="button" className="btn-context-menu" onClick={() => onAction('expire')}>
              <Trans i18nKey="expire"/>
            </button>
          </div>

          <hr className="context-menu-divider"/>

          <div className="context-menu-item" onClick={() => onAction('delete')}>
            <button type="button" className="btn-context-menu text-red-600">
              <Trans i18nKey="delete"/>
            </button>
          </div>
        </BtnContextMenu>
      </td>
    </tr>
  );
});