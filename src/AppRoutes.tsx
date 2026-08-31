import { RouteObject, useRoutes } from 'react-router';
import { lazy } from 'react';
import { ROUTES } from 'core/base/const/routes';
import App from 'App';

const HomePage = lazy(() => import('pages/Home/Home.tsx'));
const SamplePage = lazy(() => import('pages/Test/Test.tsx'));

export const AppRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.TEST,
        element: <SamplePage />,
      },
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ],
  },
];

export type { RouteObject };
export { useRoutes };
