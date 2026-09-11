import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Dropdown,
  Grid,
  Skeleton,
  Typography,
} from 'antd';
import type { MenuProps } from 'antd';
import { useCurrentUser } from 'common/hooks/useCurrentUser';
import { clearAuthUser } from 'core/api/auth/auth.slice';
import { baseApi } from 'core/api/base.api';
import { NAVIGATION_ITEMS } from 'core/base/const/navigation';
import { ROUTES } from 'core/base/const/routes';
import { AuthService } from 'core/http/auth.service';
import { useAppDispatch } from 'core/store/useAppDispatch';
import { MOCK_NOTIFICATIONS, type AdminNotification } from './notifications';

import './AdminHeader.scss';

export type AdminHeaderProps = {
  onMenuToggle?: () => void;
  showMenuToggle?: boolean;
  collapsed?: boolean;
};

/**
 * Application header: sticky warm-paper bar with blur-on-scroll,
 * sidebar toggle, breadcrumb, notification center and account menu.
 */
export const AdminHeader = ({
  onMenuToggle,
  showMenuToggle = false,
  collapsed = false,
}: AdminHeaderProps) => {
  const { t } = useTranslation(['admin']);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const screens = Grid.useBreakpoint();
  const { user, role, isLoading } = useCurrentUser();

  const [notifications, setNotifications] =
    useState<AdminNotification[]>(MOCK_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bumping, setBumping] = useState(false);
  const prevUnreadRef = useRef(0);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );
  const isMobile = !screens.md;

  useEffect(() => {
    const scroller = document.querySelector('.twk-admin-layout__content');
    if (!scroller) return;
    const onScroll = () => setScrolled(scroller.scrollTop > 8);
    onScroll();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (unreadCount > prevUnreadRef.current) {
      setBumping(true);
      const timer = window.setTimeout(() => setBumping(false), 650);
      prevUnreadRef.current = unreadCount;
      return () => window.clearTimeout(timer);
    }
    prevUnreadRef.current = unreadCount;
    return undefined;
  }, [unreadCount]);

  const handleLogout = () => {
    AuthService.clearAuth();
    dispatch(clearAuthUser());
    dispatch(baseApi.util.resetApiState());
    navigate(ROUTES.LOGIN);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const activeNav = NAVIGATION_ITEMS.find(
    (item) => item.path === location.pathname,
  );

  const breadcrumbItems = activeNav
    ? [{ title: t('header.title') }, { title: t(activeNav.labelKey) }]
    : [{ title: t('header.title') }];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('header.userMenu.profile'),
      onClick: () => navigate(ROUTES.ADMIN_SETTINGS),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('header.userMenu.settings'),
      onClick: () => navigate(ROUTES.ADMIN_SETTINGS),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('header.logout'),
      danger: true,
      onClick: handleLogout,
    },
  ];

  const initial = (user?.name ?? '?').trim().charAt(0).toUpperCase() || '?';

  const notificationPanel = (
    <div
      className="twk-admin-header__notifications-panel"
      role="dialog"
      aria-label={t('header.notifications.title')}
    >
      <div className="twk-admin-header__notifications-head">
        <Typography.Text
          className="twk-admin-header__notifications-title"
          strong
        >
          {t('header.notifications.title')}
        </Typography.Text>
        {unreadCount > 0 && (
          <Button
            className="twk-admin-header__notifications-mark"
            type="link"
            size="small"
            onClick={handleMarkAllRead}
          >
            {t('header.notifications.markAllRead')}
          </Button>
        )}
      </div>
      <div className="twk-admin-header__notifications-list">
        {notifications.length === 0 ? (
          <div className="twk-admin-header__notifications-empty">
            {t('header.notifications.empty')}
          </div>
        ) : (
          notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`twk-admin-header__notification${item.read ? '' : ' twk-admin-header__notification--unread'}`}
              onClick={() =>
                setNotifications((prev) =>
                  prev.map((n) =>
                    n.id === item.id ? { ...n, read: true } : n,
                  ),
                )
              }
            >
              <span
                className={`twk-admin-header__notification-dot${item.read ? '' : ' twk-admin-header__notification-dot--unread'}`}
                aria-hidden="true"
              />
              <span className="twk-admin-header__notification-body">
                <span className="twk-admin-header__notification-title">
                  {item.title}
                </span>
                <span className="twk-admin-header__notification-desc">
                  {item.description}
                </span>
                <span className="twk-admin-header__notification-time">
                  {item.timestamp}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <header
      className={`twk-admin-header${scrolled ? ' twk-admin-header--scrolled' : ''}${isMobile ? ' twk-admin-header__nav--mobile' : ''}`}
    >
      <div className="twk-admin-header__left">
        {showMenuToggle && (
          <Button
            className={`twk-admin-header__menu-toggle${collapsed ? ' twk-admin-header__menu-toggle--collapsed' : ''}`}
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onMenuToggle}
            aria-label={t('header.menuToggle')}
          />
        )}
        {!isMobile && (
          <div className="twk-admin-header__breadcrumb">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        )}
        {isMobile && (
          <Typography.Text className="twk-admin-header__title" strong ellipsis>
            {activeNav ? t(activeNav.labelKey) : t('header.title')}
          </Typography.Text>
        )}
      </div>
      <div className="twk-admin-header__right">
        <Dropdown
          open={notifOpen}
          onOpenChange={setNotifOpen}
          trigger={['click']}
          placement="bottomRight"
          overlayClassName="twk-admin-header__notifications-popup"
          dropdownRender={() => notificationPanel}
        >
          <Button
            className={`twk-admin-header__icon-btn${bumping ? ' twk-admin-header__icon-btn--bump' : ''}`}
            type="text"
            aria-label={t('header.notifications.ariaLabel')}
            icon={
              <Badge
                count={unreadCount}
                size="small"
                className="twk-admin-header__badge"
                aria-label={`${unreadCount}`}
              >
                <BellOutlined className="twk-admin-header__bell" />
              </Badge>
            }
          />
        </Dropdown>
        {isLoading || !user ? (
          <Skeleton.Avatar
            active
            size="small"
            className="twk-admin-header__skeleton"
          />
        ) : (
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <button
              type="button"
              className="twk-admin-header__profile"
              aria-label={t('header.userMenu.ariaLabel')}
            >
              <Avatar className="twk-admin-header__avatar" aria-hidden="true">
                {initial}
              </Avatar>
              <span className="twk-admin-header__profile-text">
                <Typography.Text
                  className="twk-admin-header__username"
                  strong
                  ellipsis
                >
                  {user.name}
                </Typography.Text>
                {role && (
                  <Typography.Text
                    className="twk-admin-header__role"
                    type="secondary"
                    ellipsis
                  >
                    {t(`roles.${role}`)}
                  </Typography.Text>
                )}
              </span>
            </button>
          </Dropdown>
        )}
        <Link
          to={ROUTES.ADMIN_SETTINGS}
          className="twk-admin-header__settings-link"
          aria-label={t('header.userMenu.settings')}
        >
          <SettingOutlined />
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;
