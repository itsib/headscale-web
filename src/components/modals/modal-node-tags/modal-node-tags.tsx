import { FC, useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from 'react-just-ui';
import { useMutation } from '@tanstack/react-query';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { fetchWithContext } from '@app-utils/query-fn';
import { Node } from '@app-types';
import { AclTag } from '@app-components/acl-tag/acl-tag';
import { ApplicationContext } from '@app-context/application';

interface FormFields {
  tagName: string;
}

export interface ModalNodeTagsProps extends ModalProps {
  node?: Node | null;
  onSuccess: () => void;
}

export const ModalNodeTags: FC<ModalNodeTagsProps> = ({ isOpen, onDismiss, node, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {node ? <ModalContent onDismiss={onDismiss} node={node} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FC<Omit<ModalNodeTagsProps, 'isOpen' | 'node'> & { node: Node }> = ({ onDismiss, onSuccess, node }) => {
  const { t } = useTranslation();
  const { storage } = useContext(ApplicationContext);
  const [tags, setTags] = useState<string[]>(node.forcedTags);
  const isDifferent = useMemo(() => {
    if (tags.length !== node.forcedTags.length) {
      return true;
    }
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] !== node.forcedTags[i]) {
        return true;
      }
    }
    return false;
  }, [tags, node.forcedTags]);

  const { handleSubmit, register, formState, reset } = useForm<FormFields>({
    defaultValues: {
      tagName: '',
    }
  });
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    async mutationFn({ id, tags }: { id: string, tags: string[] }) {
      const data = await fetchWithContext<{ node: Node }>(`/api/v1/node/${id}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tags })
      }, storage);
      return data.node;
    },
    onSuccess: () => {
      onSuccess();
      onDismiss();
    },
  });

  return (
    <div className="modal modal-confirmation w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('manage_tags_node_modal_title')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()} />
      </div>
      <div className="modal-content">
        <form
          onSubmit={handleSubmit(({ tagName }: FormFields) => {
            setTags(old => Array.from(new Set([...old, tagName])));
            reset({ tagName: '' });
          })
          }>
          <div className="text-secondary mb-4 text-sm">
            <Trans i18nKey="manage_tags_node_modal_summary"/>
          </div>
          <div className="mb-2">
            <Input
              id="new-user-name"
              autoFocus
              label={t('tag_name')}
              placeholder="tag:"
              error={errors?.tagName}
              suffix={
                <button type="submit" className="suffix hover:cursor-pointer">
                  <i className="icon icon-tag-add"/>
                </button>
              }
              {...register('tagName', {
                required: t('error_required'),
                disabled: isPending,
                validate: (value) => {
                  if (!value.startsWith('tag:')) {
                    return t('error_tag_prefix');
                  }
                  if (!/^[a-z:\-_]+$/.test(value)) {
                    return t('error_tag_format');
                  }
                  return true;
                }
              })}
            />
          </div>
          {tags.length ? (
            <div className="p-3 mb-4 border-primary border rounded-md flex flex-wrap justify-start gap-2">
              {tags.map(tag => <AclTag key={tag} tag={tag}
                                       onRemove={tag => setTags(old => old.filter(i => i !== tag))}/>)}
            </div>
          ) : null}
          <button
            type="button"
            className={`btn btn-accent w-full ${isPending ? 'loading' : ''}`}
            disabled={!isDifferent}
            onClick={() => mutate({ id: node.id, tags, })}
          >
            <span>{t('save')}</span>
          </button>
          {error ? (
            <div className="text-red-500 text-[12px] leading-[14px] mt-2 px-1">
              {t(error.message)}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};