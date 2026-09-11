import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { App as AntApp, ConfigProvider } from 'antd';
import AppLayout from 'Layout/AppLayout';
import Content from 'Layout/Content';
import { adminTheme } from 'core/base/const/adminTheme';

import './App.scss';

const App = () => {
  return (
    <div className="twk-app">
      <ConfigProvider theme={adminTheme}>
        <AntApp>
          <AppLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Content>
                <Outlet />
              </Content>
            </Suspense>
          </AppLayout>
        </AntApp>
      </ConfigProvider>
    </div>
  );
};

export default App;
