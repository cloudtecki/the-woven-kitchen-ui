import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { App as AntApp } from 'antd';
import AppLayout from 'Layout/AppLayout';
import Content from 'Layout/Content';

import './App.scss';

const App = () => {
  return (
    <div className="twk-app">
      <AntApp>
        <AppLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Content>
              <Outlet />
            </Content>
          </Suspense>
        </AppLayout>
      </AntApp>
    </div>
  );
};

export default App;
