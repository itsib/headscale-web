import { memo, useMemo, useRef } from 'react';
import { ApiToken } from '../../types';
import { Trans } from 'react-i18next';
import { ContextMenu } from '../../components/popups/context-menu.tsx';
import { PopupPlacement } from '../../components/popups/popup-base/_common.ts';
import { FormattedDate } from '../../components/formatters/formatted-date.tsx';
import { FormattedDuration } from '../../components/formatters/formatted-duration.tsx';

export type ContextAction = 'expire' | 'delete' | 'create';

export interface ApiTokenItemProps extends ApiToken {
  onAction: (action: ContextAction) => void;
}

export const ApiTokenItem = memo(function ApiTokenItem(props: ApiTokenItemProps) {
  const contextRef = useRef<HTMLButtonElement | null>(null);
  const { prefix, createdAt, expiration, lastSeen, onAction } = props;

  const isExpired = useMemo(() => (new Date(expiration).getTime() - Date.now()) < 0, [expiration]);

  return (
    <tr className="h-[60px] border-b border-b-primary">
      <td className="w-[60px]">
        <div className="w-[36px] h-[36px] rounded-full bg-green-700 bg-opacity-70 text-center">
          <i className="icon icon-keys text-[18px] leading-[36px]"/>
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
        <button
          className="text-stone-600 opacity-90 relative top-[2px] transition hover:opacity-60 hover:text-accent active:opacity-90"
          ref={contextRef}
        >
          <i className="icon icon-context-menu text-[24px]"/>
        </button>
        <ContextMenu btnOpenRef={contextRef} placement={PopupPlacement.BOTTOM}>
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
        </ContextMenu>
      </td>
    </tr>
  );
});