import { useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { BrandMarkIcon } from 'components/custom/AuthIcons';
import {
  getNavigationForRole,
  type NavigationItem,
} from 'core/base/const/navigation';
import { useCurrentUser } from 'common/hooks/useCurrentUser';

import './AdminSidebar.scss';

export type AdminSidebarProps = {
  /** Collapsed (icon-only) state — driven by the layout. */
  collapsed?: boolean;
  /** Called after a navigation item is clicked (e.g. close mobile drawer). */
  onNavigate?: () => void;
};

type SidebarGroup = {
  key: string;
  labelKey: string;
  itemKeys: string[];
};

/** Presentation grouping only — permissions still come from NAVIGATION_ITEMS. */
const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    key: 'overview',
    labelKey: 'sidebar.groups.overview',
    itemKeys: ['dashboard'],
  },
  {
    key: 'operations',
    labelKey: 'sidebar.groups.operations',
    itemKeys: ['orders', 'deliveries', 'daily-menu'],
  },
  {
    key: 'management',
    labelKey: 'sidebar.groups.management',
    itemKeys: ['customers', 'menu'],
  },
  {
    key: 'finance',
    labelKey: 'sidebar.groups.finance',
    itemKeys: ['payments', 'expenses', 'reports'],
  },
  { key: 'system', labelKey: 'sidebar.groups.system', itemKeys: ['settings'] },
];

const toMenuLabel = (
  item: NavigationItem,
  label: string,
  onNavigate?: () => void,
) => (
  <Link to={item.path} onClick={onNavigate}>
    <span className="twk-admin-sidebar__label">{label}</span>
  </Link>
);

/**
 * Role-based sidebar. Items come from NAVIGATION_ITEMS filtered by the
 * authenticated user's role — the same table route guards use. Unauthorized
 * items are never rendered. Groups are presentational submenus only.
 */
export const AdminSidebar = ({
  collapsed = false,
  onNavigate,
}: AdminSidebarProps) => {
  const { t } = useTranslation(['admin']);
  const location = useLocation();
  const { role } = useCurrentUser();

  const visibleItems = useMemo(() => getNavigationForRole(role), [role]);
  const byKey = useMemo(
    () => new Map(visibleItems.map((item) => [item.key, item])),
    [visibleItems],
  );

  const menuItems: MenuProps['items'] = useMemo(() => {
    const groups: NonNullable<MenuProps['items']> = [];
    for (const group of SIDEBAR_GROUPS) {
      const children = group.itemKeys
        .map((key) => byKey.get(key))
        .filter((item): item is NavigationItem => Boolean(item))
        .map((item) => {
          const Icon = item.icon;
          return {
            key: item.key,
            icon: <Icon className="twk-admin-sidebar__menu-icon" />,
            label: toMenuLabel(item, t(item.labelKey), onNavigate),
          };
        });
      if (children.length === 0) continue;
      // Single-item groups render flat to reduce nesting noise.
      if (
        children.length === 1 &&
        (group.key === 'overview' || group.key === 'system')
      ) {
        groups.push(...children);
        continue;
      }
      groups.push({
        key: `group-${group.key}`,
        label: (
          <span className="twk-admin-sidebar__group-label">
            {t(group.labelKey)}
          </span>
        ),
        children,
        className: 'twk-admin-sidebar__submenu',
      });
    }
    return groups;
  }, [byKey, onNavigate, t]);

  // Exact match, plus prefix match so child routes (e.g. /admin/menu/new,
  // /admin/menu/:id/edit) keep the parent entry highlighted.
  const activeKey = visibleItems.find(
    (item) =>
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`),
  )?.key;
  const defaultOpenKeys = SIDEBAR_GROUPS.map((g) => `group-${g.key}`);

  return (
    <div
      className={`twk-admin-sidebar${collapsed ? ' twk-admin-sidebar--collapsed' : ''}`}
    >
      <div className="twk-admin-sidebar__brand">
        <span className="twk-admin-sidebar__logo-wrap">
          <BrandMarkIcon className="twk-admin-sidebar__logo" />
        </span>
        {!collapsed && (
          <div className="twk-admin-sidebar__brand-text">
            <span className="twk-admin-sidebar__brand-line1">
              {t('brand.line1')}
            </span>
            <span className="twk-admin-sidebar__brand-line2">
              {t('brand.line2')}
            </span>
          </div>
        )}
      </div>
      <Menu
        className="twk-admin-sidebar__menu"
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={menuItems}
        selectedKeys={activeKey ? [activeKey] : []}
        defaultOpenKeys={defaultOpenKeys}
        aria-label={t('sidebar.ariaLabel')}
      />
      <div className="twk-admin-sidebar__foot">
        {!collapsed && (
          <span className="twk-admin-sidebar__foot-text">
            {t('brand.line2')}
          </span>
        )}
        <span className="twk-admin-sidebar__foot-dot" aria-hidden="true" />
      </div>
    </div>
  );
};

export default AdminSidebar;
