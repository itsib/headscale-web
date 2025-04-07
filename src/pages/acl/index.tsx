import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { cn } from 'react-just-ui/utils/cn';
import { useLocation } from 'preact-iso/router';
import { Redirect } from '@app-components/redirect/redirect';
import { EditFile } from './edit-file';
import { Preview } from './preview';
import { EditorLoading } from '@app-components/skeleton/editor-loading';
import './index.css';

export default function Acl() {
  const { t } = useTranslation();
  const { path } = useLocation();

  const { data: policy, isLoading } = useQuery<{ policy: string }, Error, string>({
    queryKey: ['/api/v1/policy', 'GET'],
    select: data => data.policy,
    staleTime: 0,
    refetchInterval: false,
  });

  return (
    <div className="acl-page pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            {t('access_controls')}
          </h1>
          <p className="text-secondary">
            {t('access_controls_subtitle')}
          </p>
        </div>
      </div>

      {isLoading ? null : (
        <div className="tabs-links">
          <a href="/acl/edit-file" className={cn('tab-link', { active: path.startsWith('/acl/edit-file') })}>
            <i className="icon icon-edit-code"/>
            {t('edit_file')}
          </a>
          <a href="/acl/preview" className={cn('tab-link', { active: path.startsWith('/acl/preview') })}>
            <i className="icon icon-eye"/>
            {t('preview')}
          </a>
        </div>
      )}

      {isLoading ? (
        <EditorLoading />
      ) : path === '/acl/edit-file' ? (
        <EditFile policy={policy} />
      ) : path === '/acl/preview' ? (
        <Preview policy={policy} />
      ) : (
        <Redirect to="/acl/edit-file"/>
      )}
    </div>
  );
}