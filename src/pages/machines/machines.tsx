import { FC, memo, useMemo, useRef } from 'react';
import { useNodes } from '../../hooks/use-nodes.ts';
import { Trans, useTranslation } from 'react-i18next';
import { Node } from '../../types';
import { FormattedDuration } from '../../components/formatters/formatted-duration.tsx';
import { FormattedDate } from '../../components/formatters/formatted-date.tsx';
import { PopupPlacement } from '../../components/popups/popup-base/_common.ts';
import { ContextMenu } from '../../components/popups/context-menu.tsx';

// export const API_URL_USER = '/api/v1/user';
// export const API_URL_NODE = '/api/v1/node';
// export const API_URL_MACHINE = '/api/v1/machine';
// export const API_URL_ROUTES = '/api/v1/routes';
// export const API_URL_APIKEY = '/api/v1/apikey';
// export const API_URL_PREAUTHKEY = '/api/v1/preauthkey';
// export const API_URL_DEBUG = '/api/v1/debug';

export const MachinesPage: FC = () => {
  const { t } = useTranslation();
  const { data: nodes } = useNodes();

  return (
    <div className="container">

      <table className="w-full table-auto border-spacing-px" border={1}>
        <thead>
        <tr className="border-b border-b-primary h-[50px] text-sm">
          <th className="text-left font-semibold text-secondary uppercase">{t('machine')}</th>
          <th className="text-left font-semibold text-secondary uppercase">{t('address')}</th>
          <th className="text-center font-semibold text-secondary uppercase">{t('tags')}</th>
          <th className="text-right font-semibold text-secondary uppercase">{t('last_seen')}</th>
          <th />
        </tr>
        </thead>
        <tbody>
        {nodes?.map(node => <NodeRow key={node.id} {...node} />)}
        </tbody>
      </table>
    </div>
  );
}

const NodeRow = memo(function NodeRow(props: Node) {
  const { name, givenName, expiry, ipAddresses, forcedTags, validTags, invalidTags, lastSeen, online, user } = props;
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const expiryDate = useMemo(() => new Date(expiry), [expiry]);
  const expiryDisabled = expiryDate.getFullYear() <= 1970;

  const tags = useMemo(() => {
    return validTags || forcedTags || invalidTags;
  }, [forcedTags, validTags, invalidTags]);

  return (
    <tr className="h-[80px] border-b border-b-primary">
      <td className="flex flex-col gap-0.5">
        <div className="text-primary font-bold text-lg">{givenName || name}</div>
        <div className="flex justify-start">
          {expiryDisabled ? (
            <div className="text-xs text-secondary bg-stone-300 dark:bg-stone-700 px-1 rounded-sm">
              <Trans i18nKey="expiry_disabled"/>
            </div>
          ) : (
            <div className="text-xs text-secondary bg-stone-300 dark:bg-yellow-800 px-1 rounded-sm">
              <FormattedDuration timestamp={expiryDate.getTime()}/>
            </div>
          )}
        </div>
        <div className="text-stone-400">
          {user.name}
        </div>
      </td>
      <td>
        <div className="digits py-1.5">
          <span>{ipAddresses[0]}</span>
        </div>
      </td>
      <td className="text-center">
        {tags.length ? (
          <div className="text-secondary">

          </div>
        ) : <>-</>}
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
          ref={btnRef}
        >
          <i className="icon icon-context-menu text-[24px]"/>
        </button>

        <ContextMenu btnOpenRef={btnRef} placement={PopupPlacement.BOTTOM}>
          <div className="context-menu-item">
            <button type="button" className="btn-context-menu">
              <Trans i18nKey="rename"/>
            </button>
          </div>
          <hr className="context-menu-divider" />
          <div className="context-menu-item">
            <button type="button" className="btn-context-menu text-red-600">
              <Trans i18nKey="delete"/>
            </button>
          </div>
        </ContextMenu>
      </td>
    </tr>
  );
});