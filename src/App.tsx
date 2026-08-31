import { Suspense } from 'react';
import { Outlet } from 'react-router';
import AppLayout from 'Layout/AppLayout';
import Content from 'Layout/Content';

import './App.scss';

const App = () => {
  return (
    <div className="twk-app">
      <AppLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Content>
            <Outlet />
          </Content>
        </Suspense>
      </AppLayout>
    </div>
  );
};

export default App;
