import { FC, useState } from 'react';
import { useNodes } from '../../hooks/use-nodes.ts';
import { Trans, useTranslation } from 'react-i18next';
import { Node } from '../../types';
import { ModalNodeRegister } from '../../components/modals/modal-node-register/modal-node-register.tsx';
import { ModalNodeRename } from '../../components/modals/modal-node-rename/modal-node-rename.tsx';
import { ModalNodeChown } from '../../components/modals/modal-node-chown/modal-node-chown.tsx';
import { ModalNodeDelete } from '../../components/modals/modal-node-delete/modal-node-delete.tsx';
import { ModalNodeTags } from '../../components/modals/modal-node-tags/modal-node-tags.tsx';
import { MachineItem } from './_machine-item.tsx';

export const MachinesPage: FC = () => {
  const { t } = useTranslation();
  const { data: nodes, refetch } = useNodes();

  const [opened, setOpened] = useState<'delete' | 'register' | 'rename' | 'chown' | 'expiry' | 'tags' | null>(null);
  const [selected, setSelected] = useState<Node | null>(null);

  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2"><Trans i18nKey="devices"/></h1>
          <p className="text-secondary"><Trans i18nKey="machines_page_subtitle"/></p>
        </div>

        <button type="button" className="btn btn-primary flex items-center gap-2" onClick={() => setOpened('register')}>
          <i className="icon icon-devices text-lg"/>
          <span className="font-semibold"><Trans i18nKey="register_device"/></span>
        </button>
      </div>

      <table className="w-full table-auto border-spacing-px" border={1}>
        <thead>
        <tr className="border-b border-b-primary h-[50px] text-sm font-semibold text-secondary uppercase">
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
        {nodes?.map(node => (
          <MachineItem
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
