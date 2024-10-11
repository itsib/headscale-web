import { useRoutes } from 'react-router-dom';
import { AclContent } from './acl';
import { EditFile } from './edit-file/edit-file';
import { PreviewPage } from './preview/preview.tsx';
import { FC } from 'react';

export const AclPage: FC = () => useRoutes([
  {
    path: "/",
    element: <AclContent />,
    children: [
      {
        path: '',
        element: <EditFile />,
      },
      {
        path: 'preview',
        element: <PreviewPage />
      },
    ],
  },
]);