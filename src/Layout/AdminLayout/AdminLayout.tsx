import { useState } from 'react';
import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Drawer, Grid, Layout, Spin } from 'antd';
import AdminHeader from 'components/custom/AdminHeader';
import AdminSidebar from 'components/custom/AdminSidebar';
import { useCurrentUser } from 'common/hooks/useCurrentUser';

import './AdminLayout.scss';

const { Sider, Header, Content } = Layout;

/**
 * Role-based application layout: Header + Sidebar + page content.
 * Desktop: persistent Sider (264px, icon-only 80px when collapsed).
 * Mobile (<lg): off-canvas Drawer with overlay backdrop.
 */
export const AdminLayout = () => {
  const { t } = useTranslation(['admin']);
  const { isLoading } = useCurrentUser();
  const screens = Grid.useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = !screens.lg;

  if (isLoading) {
    return (
      <div
        className="twk-admin-layout__loading"
        role="status"
        aria-live="polite"
      >
        <Spin size="large" aria-label={t('loading.message')} />
      </div>
    );
  }

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const handleNavigate = () => {
    if (isMobile) setMobileOpen(false);
  };

  return (
    <Layout className="twk-admin-layout">
      {!isMobile && (
        <Sider
          className={`twk-admin-layout__sider${collapsed ? ' twk-admin-layout__sider--collapsed' : ''}`}
          width={264}
          collapsedWidth={80}
          collapsed={collapsed}
          trigger={null}
          collapsible
        >
          <AdminSidebar collapsed={collapsed} onNavigate={handleNavigate} />
        </Sider>
      )}
      {isMobile && (
        <Drawer
          className="twk-admin-layout__drawer"
          placement="left"
          width={280}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          closable={false}
          styles={{ body: { padding: 0 } }}
        >
          <AdminSidebar onNavigate={handleNavigate} />
        </Drawer>
      )}
      <Layout className="twk-admin-layout__inner">
        <Header className="twk-admin-layout__header">
          <AdminHeader
            showMenuToggle
            collapsed={isMobile ? mobileOpen : collapsed}
            onMenuToggle={handleToggle}
          />
        </Header>
        <Content className="twk-admin-layout__content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
