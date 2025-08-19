import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CogIcon, 
  ChartBarIcon,
  CalendarIcon,
  TagIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    // Make sure /admin matches exactly, but other paths can be partial matches
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { name: t('admin.dashboard'), path: '/admin', icon: HomeIcon },
    { name: t('admin.orders'), path: '/admin/orders', icon: ShoppingBagIcon },
    { name: t('admin.products'), path: '/admin/products', icon: TagIcon },
    { name: t('admin.users'), path: '/admin/users', icon: UserGroupIcon },
    { name: t('admin.bookings'), path: '/admin/bookings', icon: CalendarIcon },
    { name: t('admin.reports'), path: '/admin/reports', icon: ChartBarIcon },
    { name: t('admin.settings'), path: '/admin/settings', icon: CogIcon },
  ];

  return (
    <div className="flex h-screen bg-secondary-bg">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-primary-bg shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-border-color">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/Assets/su_curries_logo.png"
                  alt="SU Foods"
                  className="h-8 w-auto border border-gray-200 rounded-md p-1"
                />
              </Link>
              <Link to="/admin" className="ml-2 text-xl font-semibold text-text-primary">Admin</Link>
            </div>
            <button 
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-text-secondary" />
            </button>
          </div>

          {/* Sidebar navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-accent-color text-white'
                        : 'text-text-secondary hover:bg-secondary-bg hover:text-text-primary'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-border-color p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-text-secondary hover:bg-secondary-bg hover:text-text-primary rounded-md transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
              <span>{t('admin.logout')}</span>
            </button>
            <Link
              to="/"
              className="flex w-full items-center px-4 py-3 mt-2 text-text-secondary hover:bg-secondary-bg hover:text-text-primary rounded-md transition-colors"
            >
              <span>{t('admin.back_to_site')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-primary-bg shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6 text-text-secondary" />
            </button>
            <div className="flex items-center">
              <span className="text-text-secondary mr-2">{t('admin.logged_in_as')}</span>
              <span className="font-medium text-text-primary">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;