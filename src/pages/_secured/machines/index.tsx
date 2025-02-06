import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { ModalNodeCreate } from '../../../components/modals/modal-node-create/modal-node-create.tsx';
import { fetchWithContext } from '../../../utils/query-fn.ts';
import { ListLoading } from '../../../components/skeleton/list-loading.tsx';
import { Node } from '../../../types';
import { ContextAction } from './-machine-menu.tsx';
import { MachineItem } from './-machine-item.tsx';
import { ModalNodeRename } from '../../../components/modals/modal-node-rename/modal-node-rename.tsx';
import { ModalNodeChown } from '../../../components/modals/modal-node-chown/modal-node-chown.tsx';
import { ModalNodeDelete } from '../../../components/modals/modal-node-delete/modal-node-delete.tsx';
import { ModalNodeRoutes } from '../../../components/modals/modal-node-routes/modal-node-routes.tsx';
import { ModalNodeTags } from '../../../components/modals/modal-node-tags/modal-node-tags.tsx';
import { ModalNodeExpire } from '../../../components/modals/modal-node-expire/modal-node-expire.tsx';
import { REFRESH_INTERVAL } from '../../../config.ts';

export const Route = createFileRoute('/_secured/machines/')({
  loader: ({context, abortController}) => {
    return fetchWithContext(
      '/api/v1/node',
      {signal: abortController.signal},
      context.storage,
    );
  },
  component: Component,
  pendingComponent: Pending,
});

function Component() {
  const {t} = useTranslation();
  const {nodes} = Route.useLoaderData() as { nodes: Node[] };
  const {invalidate} = useRouter();

  const [opened, setOpened] = useState<ContextAction | null>(null);
  const [selected, setSelected] = useState<Node | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    async function update() {
      await invalidate();
      timer = setTimeout(update, REFRESH_INTERVAL);
    }

    timer = setTimeout(update, REFRESH_INTERVAL);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }, []);

  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="devices"/>
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="machines_page_subtitle"/>
          </p>
        </div>

        <button
          type="button"
          className="btn btn-accent flex items-center gap-2"
          onClick={() => setOpened('create')}
        >
          <i className="icon icon-devices text-lg text-white"/>
          <span className="font-medium text-white">
            <Trans i18nKey="register_device"/>
          </span>
        </button>
      </div>

      {nodes?.length ? (
        <table className="w-full table-auto border-spacing-px" border={1}>
          <thead>
          <tr className="border-b border-b-primary h-[30px] text-xs font-medium text-secondary uppercase">
            <th/>
            <th className="text-left ">{t('machine')}</th>
            <th className="text-left">{t('user')}</th>
            <th className="text-center ">{t('tags')}</th>
            <th className="text-center pr-8">{t('address')}</th>
            <th className="text-right">{t('last_seen')}</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {nodes?.map((node) => (
            <MachineItem
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
          <Trans i18nKey="empty_list"/>
        </div>
      )}

      <ModalNodeCreate
        isOpen={opened === 'create'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
      <ModalNodeRename
        node={selected}
        isOpen={opened === 'rename'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
      <ModalNodeChown
        node={selected}
        isOpen={opened === 'chown'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
      <ModalNodeDelete
        node={selected}
        isOpen={opened === 'delete'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
      <ModalNodeRoutes
        node={selected}
        isOpen={opened === 'routes'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
      <ModalNodeTags
        node={selected}
        isOpen={opened === 'tags'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
      <ModalNodeExpire
        node={selected}
        isOpen={opened === 'expiry'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
    </div>
  );
}

function Pending() {
  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="devices"/>
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="machines_page_subtitle"/>
          </p>
        </div>
      </div>

      <ListLoading/>
    </div>
  );
}