import { Node } from '../../../types';
import { memo, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { FormattedDuration } from '../../../components/formatters/formatted-duration.tsx';
import { UserInfo } from '../../../components/user-info/user-info.tsx';
import { AclTag } from '../../../components/acl-tag/acl-tag.tsx';
import { IpAddresses } from '../../../components/ip-addresses/ip-addresses.tsx';
import { FormattedDate } from '../../../components/formatters/formatted-date.tsx';
import { ContextMenu } from '../../../components/popups/context-menu.tsx';
import { PopupPlacement } from '../../../components/popups/popup-base/_common.ts';
import { ContextAction, MachineMenu } from './-machine-menu.tsx';

export interface NodeRowProps extends Node {
  onAction: (name: ContextAction) => void;
}

export const MachineItem = memo(function NodeRow({ onAction, ...node }: NodeRowProps) {
  const { name, givenName, expiry, ipAddresses, forcedTags, lastSeen, online, user } = node;

  const expiryDate = useMemo(() => new Date(expiry), [expiry]);
  const expiryDisabled = expiryDate.getFullYear() <= 1970;

  return (
    <tr className="h-[80px] border-b border-b-primary">
      <td className="w-[60px]">
        <div className="w-[36px] h-[36px] rounded-full bg-blue-700 bg-opacity-70 text-center text-white">
          <i className="icon icon-connection text-[18px] leading-[36px]"/>
        </div>
      </td>
      <td className="">
        <div className="text-primary font-medium text-lg">{givenName || name}</div>
        <div className="flex justify-start">
          {expiryDisabled ? (
            <div className="text-secondary text-xs font-normal">
              <Trans i18nKey="expiry_disabled"/>
            </div>
          ) : (
            <div className="text-secondary text-xs font-normal">
              <FormattedDuration timestamp={expiryDate.getTime()}/>
            </div>
          )}
        </div>
      </td>
      <td className="text-center">
        <UserInfo id={user.id}  name={user.name} displayName={user.displayName} pictureUrl={user.profilePicUrl} size={30}  />
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
        <ContextMenu
          placement={PopupPlacement.BOTTOM}
          menu={() => (
            <MachineMenu onAction={onAction} />
          )}
        >
          <button type="button" className="text-neutral-300 dark:text-neutral-600 opacity-90 relative top-[2px] transition hover:opacity-60 hover:text-accent active:opacity-90">
            <i className="icon icon-context-menu text-[24px]"/>
          </button>
        </ContextMenu>
      </td>
    </tr>
  );
});
