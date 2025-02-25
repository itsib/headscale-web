import { Trans, useTranslation } from 'react-i18next';
import { useMemo, useState } from 'preact/hooks';
import { memo } from 'preact/compat';
import { ModalNodeCreate } from '@app-components/modals/modal-node-create/modal-node-create';
import { fetchWithContext } from '@app-utils/query-fn';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { Node } from '@app-types';
import { NodesContextMenu, NodesContextMenuAction } from '@app-components/nodes-context-menu/nodes-context-menu';
import { ModalNodeRename } from '@app-components/modals/modal-node-rename/modal-node-rename';
import { ModalNodeChown } from '@app-components/modals/modal-node-chown/modal-node-chown';
import { ModalNodeDelete } from '@app-components/modals/modal-node-delete/modal-node-delete';
import { ModalNodeRoutes } from '@app-components/modals/modal-node-routes/modal-node-routes';
import { ModalNodeTags } from '@app-components/modals/modal-node-tags/modal-node-tags';
import { ModalNodeExpire } from '@app-components/modals/modal-node-expire/modal-node-expire';
import { useQuery } from '@tanstack/react-query';
import { useStorage } from '@app-hooks/use-storage';
import { REFRESH_INTERVAL } from '@app-config';
import { FormattedDuration } from '@app-components/formatters/formatted-duration';
import { UserInfo } from '@app-components/user-info/user-info';
import { AclTag } from '@app-components/acl-tag/acl-tag';
import { IpAddresses } from '@app-components/ip-addresses/ip-addresses';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { ContextMenu } from '@app-components/popups/context-menu';
import { PopupPlacement } from '@app-components/popups/base-popup/base-popup';

export function Nodes() {
  const { t } = useTranslation();
  const storage = useStorage();

  const [opened, setOpened] = useState<NodesContextMenuAction | null>(null);
  const [selected, setSelected] = useState<Node | null>(null);

  const { data: nodes, isLoading, refetch } = useQuery({
    queryKey: ['/api/v1/node'],
    queryFn: async ({ queryKey, signal }) => {
      const data = await fetchWithContext<{ nodes: Node[] }>(
        queryKey[0] as string,
        { signal },
        storage,
      );
      return data.nodes;
    },
    staleTime: REFRESH_INTERVAL,
    refetchInterval: REFRESH_INTERVAL,
  });

  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="devices" />
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="machines_page_subtitle" />
          </p>
        </div>

        <button
          type="button"
          className="btn btn-accent flex items-center gap-2"
          onClick={() => setOpened('create')}
        >
          <i className="icon icon-devices text-lg text-white" />
          <span className="font-medium text-white">
            <Trans i18nKey="register_device" />
          </span>
        </button>
      </div>

      {isLoading ? (
        <ListLoading />
      ) : nodes?.length ? (
        <table className="w-full table-auto border-spacing-px">
          <thead>
            <tr className="border-b border-b-primary h-[30px] text-xs font-medium text-secondary uppercase">
              <th />
              <th className="text-left ">{t('machine')}</th>
              <th className="text-left">{t('user')}</th>
              <th className="text-center ">{t('tags')}</th>
              <th className="text-center pr-8">{t('address')}</th>
              <th className="text-right">{t('last_seen')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {nodes?.map((node) => (
              <NodeItem
                key={node.id}
                onAction={(action) => {
                  setSelected(node);
                  setOpened(action);
                }}
                {...node}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="border-primary border rounded-md p-8 text-center">
          <Trans i18nKey="empty_list" />
        </div>
      )}

      <ModalNodeCreate
        isOpen={opened === 'create'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeRename
        node={selected}
        isOpen={opened === 'rename'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeChown
        node={selected}
        isOpen={opened === 'chown'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeDelete
        node={selected}
        isOpen={opened === 'delete'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeRoutes
        node={selected}
        isOpen={opened === 'routes'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeTags
        node={selected}
        isOpen={opened === 'tags'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeExpire
        node={selected}
        isOpen={opened === 'expiry'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

interface NodeRowProps extends Node {
  onAction: (name: NodesContextMenuAction) => void;
}

const NodeItem = memo(function NodeRow({ onAction, ...node }: NodeRowProps) {
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
          Menu={()=> <NodesContextMenu onAction={onAction} />}
        >
          <button type="button" className="text-neutral-300 dark:text-neutral-600 opacity-90 relative top-[2px] transition hover:opacity-60 hover:text-accent active:opacity-90">
            <i className="icon icon-context-menu text-[24px]"/>
          </button>
        </ContextMenu>
      </td>
    </tr>
  );
});
