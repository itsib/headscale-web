import { FC } from 'react';
import { createBrowserRouter as createRouter, isRouteErrorResponse, Navigate, useRouteError } from 'react-router-dom';
import { Error500Page } from './error-500/error-500-page';
import { Error404Page } from './error-404/error-404.page';
import { MachinesPage } from './machines/machines.tsx';
import { LayoutPage } from './layout.tsx';
import { HomePage } from './home/home.tsx';
import { UsersPage } from './users/users.tsx';

const ErrorBoundary: FC = () => {
  const error = useRouteError();
  console.error(error);
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <Navigate to="/error-404" replace />;
    }
  }
  return <Error500Page error={error} />;
};

export const ROUTES = createRouter(
  [
    {
      path: '/',
      element: <LayoutPage />,
      ErrorBoundary,
      children: [
        {
          index: true,
          Component: HomePage,
        },
        {
          path: 'machines',
          Component: MachinesPage,
        },
        {
          path: 'users',
          Component: UsersPage,
        },
      ],
    },
    {
      path: 'error-404',
      Component: Error404Page,
    },
    {
      path: 'error-500',
      Component: Error500Page,
    },
    {
      path: '*',
      Component: Error404Page,
    },
  ],
  { basename: '/' },
);
