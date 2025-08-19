import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Dashboard from '../../components/admin/Dashboard';
import OrdersManagement from '../../components/admin/OrdersManagement';
import ProductsManagement from '../../components/admin/ProductsManagement';
import InventoryManagement from '../../components/admin/InventoryManagement';
import UsersManagement from '../../components/admin/UsersManagement';
import BookingsManagement from '../../components/admin/BookingsManagement';
import MarketingManagement from '../../components/admin/MarketingManagement';
import ReportsAnalytics from '../../components/admin/ReportsAnalytics';
import CustomerService from '../../components/admin/CustomerService';
import FinancialManagement from '../../components/admin/FinancialManagement';
import SettingsManagement from '../../components/admin/SettingsManagement';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  CubeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  CogIcon,
  MegaphoneIcon,
  DocumentChartBarIcon,
  ChatBubbleLeftRightIcon,
  BuildingStorefrontIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');

  // Check if user is admin
  if (isAuthenticated && user && user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingCartIcon },
    { id: 'products', name: 'Products', icon: CubeIcon },
    { id: 'inventory', name: 'Inventory', icon: BuildingStorefrontIcon },
    { id: 'users', name: 'Users', icon: UserGroupIcon },
    { id: 'bookings', name: 'Bookings', icon: CalendarIcon },
    { id: 'marketing', name: 'Marketing', icon: MegaphoneIcon },
    { id: 'reports', name: 'Reports', icon: DocumentChartBarIcon },
    { id: 'customer-service', name: 'Customer Service', icon: ChatBubbleLeftRightIcon },
    { id: 'financial', name: 'Financial', icon: CurrencyEuroIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveModule} />;
      case 'orders':
        return <OrdersManagement />;
      case 'products':
        return <ProductsManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'users':
        return <UsersManagement />;
      case 'bookings':
        return <BookingsManagement />;
      case 'marketing':
        return <MarketingManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'customer-service':
        return <CustomerService />;
      case 'financial':
        return <FinancialManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return (
          <div className="bg-[#2d2d2d] p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-white mb-4">{menuItems.find(item => item.id === activeModule)?.name}</h2>
            <p className="text-[#cccccc]">This module is under development. Coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      {/* Sidebar */}
      <div className="w-64 bg-[#2d2d2d] shadow-lg flex-shrink-0">
        <div className="p-6 border-b border-[#404040]">
          <div className="flex items-center">
            <img
              src="/Assets/su_curries_logo.png"
              alt="SU Foods"
              className="h-8 w-auto mr-3"
            />
            <h1 className="text-xl font-bold text-white">Admin</h1>
          </div>
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-[#404040] transition-colors ${
                  activeModule === item.id ? 'bg-[#ff6b35] text-white border-r-2 border-[#ff6b35]' : 'text-[#cccccc] hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#404040] mt-auto">
          <button
            onClick={() => navigate('/')}
            className="w-full text-left text-[#cccccc] hover:text-white text-sm"
          >
            ← Back to Website
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-x-auto bg-[#1a1a1a]">
        <div className="p-8 min-w-max">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;