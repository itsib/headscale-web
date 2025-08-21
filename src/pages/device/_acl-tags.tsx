import { FunctionComponent } from 'preact';
import { cn } from 'react-just-ui/utils/cn';
import { useTranslation } from 'react-i18next';
import { AclTag } from '@app-components/acl-tag/acl-tag';
import { useState } from 'preact/hooks';
import { useNotifyQuery } from '@app-hooks/use-notify-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFn } from '@app-utils/query-fn';
import { Device } from '@app-types';
import { concatAclTags } from '@app-utils/concat-acl-tags';
import { Input } from 'react-just-ui';
import { useForm } from 'react-hook-form';
import './_acl-tags.css';

export interface AclTagsProps {
  deviceId?: string;
  validTags?: string[];
  invalidTags?: string[];
  forcedTags?: string[];
  className?: string;
}

export const AclTags: FunctionComponent<AclTagsProps> = (props) => {
  const { deviceId, validTags, invalidTags, forcedTags, className } = props;
  const { t } = useTranslation();
  const { start, success, error } = useNotifyQuery();
  const queryClient = useQueryClient();

  const [tags, setTags] = useState<string[]>(forcedTags ?? []);

  const { handleSubmit, register, formState, reset, setError } = useForm<{ tag: string }>({
    defaultValues: {
      tag: '',
    },
    mode: 'onChange',
    delayError: 1000,
  });
  const { errors, isValid } = formState;

  const {
    mutate,
    isPending,
    error: tagsError,
  } = useMutation({
    async mutationFn({ deviceId, tags }: { deviceId: string; tags: string[] }) {
      return await fetchFn<{ node: Device }>(`/api/v1/node/${deviceId}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tags }),
      });
    },
    onMutate: () => {
      start();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`/api/v1/node/${deviceId}`], data);
      success();
    },
    onError: (e: any) => {
      setTags(concatAclTags(validTags, invalidTags, forcedTags));
      error(e.message);
      setError('tag', { message: e.message });
    },
  });

  function submit({ tag }: { tag: string }) {
    if (!isValid) return;

    const _tags = [...tags, tag];

    setTags(_tags);

    mutate({ deviceId: deviceId!, tags: _tags });

    reset({ tag: '' });
  }

  function remove(tag: string) {
    const _tags = tags.filter((_tag) => _tag !== tag);

    setTags(_tags);

    mutate({ deviceId: deviceId!, tags: _tags });
  }

  return (
    <div className={cn('acl-tags', className)}>
      <h3 className="title">{t('acl_tags')}</h3>
      <div className="sub-title">{t('acl_tags_summary')}</div>

      <form onSubmit={handleSubmit(submit)}>
        <div className="mb-2">
          <Input
            id="tag-name-input"
            label={t('tag_name')}
            placeholder="tag:"
            error={errors?.tag}
            suffix={
              <button type="submit" className="suffix hover:cursor-pointer">
                <i className="icon icon-tag-add" />
              </button>
            }
            {...register('tag', {
              required: t('error_required'),
              disabled: isPending,
              validate: (value) => {
                if (!value.startsWith('tag:')) {
                  return t('error_tag_prefix');
                }
                if (!/^[a-z:\-_]+$/.test(value)) {
                  return t('error_tag_format');
                }
                if (tags.includes(value)) {
                  return t('error_tag_already_exists');
                }
                if (tagsError) {
                  return t(tagsError.message);
                }
                return true;
              },
            })}
          />
        </div>
      </form>

      {tags.length ? (
        <div className="acl-tags-container">
          {tags.map((tag) => (
            <AclTag key={tag} tag={tag} onRemove={remove} />
          ))}
        </div>
      ) : null}
    </div>
  );
};
