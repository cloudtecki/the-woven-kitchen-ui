import type { ThemeConfig } from 'antd';

/**
 * Cloud Kitchen Admin Panel — Ant Design theme tokens.
 * Mirrors the CSS variables in `assets/scss/theme/_admin-shell.scss`
 * so app-wide antd components stay consistent without ad-hoc overrides.
 */
export const adminTheme: ThemeConfig = {
  token: {
    colorPrimary: '#ea580c',
    colorPrimaryHover: '#c2410c',
    colorPrimaryActive: '#9a3412',
    colorLink: '#c2410c',
    colorLinkHover: '#9a3412',
    colorBgLayout: '#faf7f2',
    colorBgContainer: '#fffdf8',
    colorText: '#1c1917',
    colorTextSecondary: '#78716c',
    colorBorder: '#e9e0d3',
    colorBorderSecondary: '#f2eadd',
    colorSuccess: '#15803d',
    colorWarning: '#b45309',
    colorError: '#dc2626',
    colorInfo: '#0f69ae',
    borderRadius: 10,
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Layout: {
      siderBg: '#1f1a15',
      headerBg: '#fffdf8',
      bodyBg: '#faf7f2',
    },
    Menu: {
      darkItemBg: '#1f1a15',
      darkItemColor: '#ede8e1',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.06)',
      darkItemHoverColor: '#ffffff',
      darkItemSelectedBg: 'rgba(234, 88, 12, 0.2)',
      darkItemSelectedColor: '#ffffff',
      darkSubMenuItemBg: '#1f1a15',
      itemSelectedBg: '#ffedd5',
      itemSelectedColor: '#7c2d12',
      itemHoverBg: '#ffedd5',
      itemHoverColor: '#9a3412',
      itemActiveBg: '#fed7aa',
      itemBorderRadius: 10,
    },
    Badge: {
      colorError: '#dc2626',
    },
    Avatar: {
      colorTextPlaceholder: '#ffffff',
    },
    Breadcrumb: {
      linkColor: '#78716c',
      linkHoverColor: '#9a3412',
      separatorColor: '#a8a29e',
      itemColor: '#1c1917',
    },
  },
};

export default adminTheme;
