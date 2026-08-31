import 'antd/dist/reset.css'; // Required for AntD v5 / v6
import './index.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Provider as StoreProvider } from 'react-redux';
import { store } from 'core/store/configureStore.ts';
import './i18n';
import { AppRoutes } from 'AppRoutes.tsx';

const router = createBrowserRouter(AppRoutes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider store={store}>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>,
);
