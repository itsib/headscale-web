import { useTranslation } from 'react-i18next';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { useQuery } from '@tanstack/react-query';
import { cn } from 'react-just-ui/utils/cn';
import { useLocation } from 'preact-iso/router';
import { Redirect } from '@app-components/redirect/redirect';
import { EditFile } from './edit-file';
import { Preview } from './preview';
import { fetchWithContext } from '@app-utils/query-fn';
import { useStorage } from '@app-hooks/use-storage';
import './index.css';

export default function Acl() {
  const { t } = useTranslation();
  const storage = useStorage();
  const { path } = useLocation();

  const { data: policy, isLoading } = useQuery({
    queryKey: ['/api/v1/policy', 'GET'],
    queryFn: async ({  queryKey, signal }) => {
      try {
        const data = await fetchWithContext<{ policy: string }>(
          queryKey[0] as string,
          { signal },
          storage,
        );
        return data.policy;
      } catch (error: any) {
        if (error.code === 500 && error.message.includes('acl policy not found')) {
          return null;
        }
        if (error.code === 401) {
          await storage.deleteAppStore('main-token');
        }
        throw error;
      }
    },
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
        <ListLoading/>
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