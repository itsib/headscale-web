import { Node } from '../../types';
import { memo, useMemo, useRef } from 'react';
import { Trans } from 'react-i18next';
import { FormattedDuration } from '../../components/formatters/formatted-duration.tsx';
import { UserInfo } from '../../components/user-info/user-info.tsx';
import { AclTag } from '../../components/acl-tag/acl-tag.tsx';
import { IpAddresses } from '../../components/ip-addresses/ip-addresses.tsx';
import { FormattedDate } from '../../components/formatters/formatted-date.tsx';
import { ContextMenu } from '../../components/popups/context-menu.tsx';
import { PopupPlacement } from '../../components/popups/popup-base/_common.ts';

export type ContextAction = 'delete' | 'create' | 'rename' | 'chown' | 'expiry' | 'tags';

export interface NodeRowProps extends Node {
  onAction: (name: ContextAction) => void;
}

export const MachineItem = memo(function NodeRow({ onAction, ...node }: NodeRowProps) {
  const { name, givenName, expiry, ipAddresses, forcedTags, lastSeen, online, user } = node;
  const contextRef = useRef<HTMLButtonElement | null>(null);

  const expiryDate = useMemo(() => new Date(expiry), [expiry]);
  const expiryDisabled = expiryDate.getFullYear() <= 1970;

  return (
    <tr className="h-[80px] border-b border-b-primary">
      <td className="w-[60px]">
        <div className="w-[36px] h-[36px] rounded-full bg-blue-700 bg-opacity-70 text-center">
          <i className="icon icon-connection text-[18px] leading-[36px]"/>
        </div>
      </td>
      <td className="">
        <div className="text-primary font-semibold text-lg">{givenName || name}</div>
        <div className="flex justify-start">
          {expiryDisabled ? (
            <div className="text-xs text-secondary bg-stone-300 dark:bg-stone-700 px-1 rounded-sm">
              <Trans i18nKey="expiry_disabled"/>
            </div>
          ) : (
            <div className="text-xs text-secondary bg-stone-300 dark:bg-stone-700 px-1 rounded-sm">
              <FormattedDuration timestamp={expiryDate.getTime()}/>
            </div>
          )}
        </div>
      </td>
      <td className="text-center">
        <UserInfo {...user} />
      </td>
      <td className="text-center">
        {forcedTags.length ? (
          <div className="flex justify-center gap-2 flex-wrap">
            {forcedTags.map(tag => <AclTag key={tag} tag={tag}/>)}
          </div>
        ) : <>-</>}
      </td>
      <td className="text-center">
        <IpAddresses addresses={ipAddresses}/>
      </td>
      <td className="text-right">
        <div>
          <span
            className={`h-2 w-2 mr-3 mb-[1px] rounded-full inline-block ${online ? 'bg-green-500' : 'bg-gray-500'}`}/>
          <FormattedDate iso={lastSeen} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
        </div>
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
            <button type="button" className="btn-context-menu" onClick={() => onAction('rename')}>
              <Trans i18nKey="rename"/>
            </button>
          </div>
          <div className="context-menu-item">
            <button type="button" className="btn-context-menu" onClick={() => onAction('chown')}>
              <Trans i18nKey="change_owner"/>
            </button>
          </div>
          <div className="context-menu-item" onClick={() => onAction('expiry')}>
            <button type="button" className="btn-context-menu">
              <Trans i18nKey="expire_key"/>
            </button>
          </div>
          <div className="context-menu-item" onClick={() => onAction('tags')}>
            <button type="button" className="btn-context-menu">
              <Trans i18nKey="edit_acl_tags"/>
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
