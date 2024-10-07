import { useRoutes } from 'react-router-dom';
import { AclPage } from './acl';
import { EditFile } from './edit-file/edit-file';
import { PreviewPage } from './preview/preview.tsx';
import { FC } from 'react';

export const Routes: FC = () => useRoutes([
  {
    path: "/",
    element: <AclPage />,
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