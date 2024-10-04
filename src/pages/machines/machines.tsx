import { FC, memo, useMemo, useRef, useState } from 'react';
import { useNodes } from '../../hooks/use-nodes.ts';
import { Trans, useTranslation } from 'react-i18next';
import { Node } from '../../types';
import { FormattedDuration } from '../../components/formatters/formatted-duration.tsx';
import { FormattedDate } from '../../components/formatters/formatted-date.tsx';
import { PopupPlacement } from '../../components/popups/popup-base/_common.ts';
import { ContextMenu } from '../../components/popups/context-menu.tsx';
import { ModalNodeRegister } from '../../components/modals/modal-node-register/modal-node-register.tsx';
import { IpAddresses } from '../../components/ip-addresses/ip-addresses.tsx';
import { Avatar } from 'react-just-ui';
import { getAvatarUrl } from '../../utils/get-avatar-url.ts';
import { ModalNodeRename } from '../../components/modals/modal-node-rename/modal-node-rename.tsx';
import { ModalNodeChown } from '../../components/modals/modal-node-chown/modal-node-chown.tsx';
import { ModalNodeDelete } from '../../components/modals/modal-node-delete/modal-node-delete.tsx';
import { ModalNodeTags } from '../../components/modals/modal-node-tags/modal-node-tags.tsx';
import { AclTag } from '../../components/acl-tag/acl-tag.tsx';

// export const API_URL_USER = '/api/v1/user';
// export const API_URL_NODE = '/api/v1/node';
// export const API_URL_MACHINE = '/api/v1/machine';
// export const API_URL_ROUTES = '/api/v1/routes';
// export const API_URL_APIKEY = '/api/v1/apikey';
// export const API_URL_PREAUTHKEY = '/api/v1/preauthkey';
// export const API_URL_DEBUG = '/api/v1/debug';

export const MachinesPage: FC = () => {
  const { t } = useTranslation();
  const { data: nodes, refetch } = useNodes();

  const [opened, setOpened] = useState<'delete' | 'register' | 'rename' | 'chown' | 'expiry' | 'tags' | null>(null);
  const [selected, setSelected] = useState<Node | null>(null);

  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2"><Trans i18nKey="machines"/></h1>
          <p className="text-secondary"><Trans i18nKey="machines_page_subtitle"/></p>
        </div>

        <button type="button" className="btn-primary" onClick={() => setOpened('register')}>
          <i className="icon icon-devices text-lg"/>
          <span><Trans i18nKey="register_device"/></span>
        </button>
      </div>

      <table className="w-full table-auto border-spacing-px" border={1}>
        <thead>
        <tr className="border-b border-b-primary h-[50px] text-sm">
          <th/>
          <th className="text-left font-semibold text-secondary uppercase">{t('machine')}</th>
          <th className="text-left font-semibold text-secondary uppercase">{t('address')}</th>
          <th className="text-center font-semibold text-secondary uppercase">{t('tags')}</th>
          <th className="text-right font-semibold text-secondary uppercase">{t('last_seen')}</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {nodes?.map(node => (
          <NodeRow
            key={node.id}
            onRename={node => {
              setSelected(node);
              setOpened('rename');
            }}
            onDelete={node => {
              setSelected(node);
              setOpened('delete');
            }}
            onChown={node => {
              setSelected(node);
              setOpened('chown');
            }}
            onExpiry={node => {
              setSelected(node);
              setOpened('expiry');
            }}
            onTags={node => {
              setSelected(node);
              setOpened('tags');
            }}
            {...node} />
        ))}
        </tbody>
      </table>

      <ModalNodeRegister
        isOpen={opened === 'register'}
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
      <ModalNodeTags
        node={selected}
        isOpen={opened === 'tags'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

interface NodeRowProps extends Node {
  onDelete: (user: Node) => void;
  onRename: (user: Node) => void;
  onChown: (user: Node) => void;
  onExpiry: (user: Node) => void;
  onTags: (user: Node) => void;
}

const NodeRow = memo(function NodeRow({ onDelete, onRename, onChown, onExpiry, onTags, ...node }: NodeRowProps) {
  const { name, givenName, expiry, ipAddresses, forcedTags, lastSeen, online, user } = node;
  const contextRef = useRef<HTMLButtonElement | null>(null);

  const expiryDate = useMemo(() => new Date(expiry), [expiry]);
  const expiryDisabled = expiryDate.getFullYear() <= 1970;

  return (
    <tr className="h-[80px] border-b border-b-primary">
      <td className="w-[60px]">
        <img src="/images/laptop.svg" alt="Laptop" className="w-[36px] h-[36px]" />
      </td>
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
        <div className="text-stone-400 flex gap-1.5 items-center">
          <Avatar src={getAvatarUrl(user.id)} alt="Avatar" size={14} className="relative top-[1px]" />
          <span>{user.name}</span>
        </div>
      </td>
      <td>
        <IpAddresses addresses={ipAddresses} />
      </td>
      <td className="text-center">
        {forcedTags.length ? (
          <div className="flex justify-center">
            {forcedTags.map(tag => <AclTag key={tag} tag={tag} />)}
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
          ref={contextRef}
        >
          <i className="icon icon-context-menu text-[24px]"/>
        </button>

        <ContextMenu btnOpenRef={contextRef} placement={PopupPlacement.BOTTOM}>
          <div className="context-menu-item">
            <button type="button" className="btn-context-menu" onClick={() => onRename(node)}>
              <Trans i18nKey="rename"/>
            </button>
          </div>
          <div className="context-menu-item">
            <button type="button" className="btn-context-menu" onClick={() => onChown(node)}>
              <Trans i18nKey="change_owner"/>
            </button>
          </div>
          <div className="context-menu-item" onClick={() => onExpiry(node)}>
            <button type="button" className="btn-context-menu">
              <Trans i18nKey="expire_key"/>
            </button>
          </div>
          <div className="context-menu-item" onClick={() => onTags(node)}>
            <button type="button" className="btn-context-menu">
              <Trans i18nKey="edit_acl_tags"/>
            </button>
          </div>

          <hr className="context-menu-divider"/>

          <div className="context-menu-item" onClick={() => onDelete(node)}>
            <button type="button" className="btn-context-menu text-red-600">
              <Trans i18nKey="delete"/>
            </button>
          </div>
        </ContextMenu>
      </td>
    </tr>
  );
});