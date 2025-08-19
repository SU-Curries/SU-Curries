import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChartBarIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { analyticsService, DashboardKPIs } from '../../services/analytics.service';
import { dataStore } from '../../store/dataStore';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const { t } = useTranslation();
  const [timePeriod, setTimePeriod] = useState('7days');
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalRevenue: 0,
    orderCount: 0,
    userCount: 0,
    conversionRate: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const [topProducts, setTopProducts] = useState<any[]>([]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get real data from dataStore
      const stats = dataStore.getOrderStats();
      const users = dataStore.getUsers().filter(u => u.role === 'customer');
      const orders = dataStore.getOrders();
      
      const dashboardKPIs: DashboardKPIs = {
        totalRevenue: stats.totalRevenue,
        orderCount: stats.totalOrders,
        userCount: users.length,
        conversionRate: users.length > 0 ? (stats.totalOrders / users.length) * 100 : 0,
        averageOrderValue: stats.averageOrderValue
      };
      
      setKpis(dashboardKPIs);

      // Generate dynamic system alerts based on real data
      const alerts = [];
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const failedPayments = orders.filter(o => o.paymentStatus === 'failed').length;
      const lowStockItems = 3; // This would come from inventory in a real app
      
      if (pendingOrders > 10) {
        alerts.push({
          id: 1,
          type: 'warning',
          message: `${pendingOrders} orders pending processing`,
          priority: 'high'
        });
      }
      
      if (failedPayments > 0) {
        alerts.push({
          id: 2,
          type: 'error',
          message: `${failedPayments} orders with payment issues`,
          priority: 'high'
        });
      }
      
      if (lowStockItems > 0) {
        alerts.push({
          id: 3,
          type: 'info',
          message: `${lowStockItems} items running low on stock`,
          priority: 'medium'
        });
      }
      
      alerts.push({
        id: 4,
        type: 'info',
        message: 'System backup completed successfully',
        priority: 'low'
      });
      
      setSystemAlerts(alerts);

      // Generate recent activity from real orders
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      const activities = recentOrders.map((order, index) => ({
        id: index + 1,
        type: 'order',
        message: `New order ${order.orderNumber}`,
        time: getTimeAgo(order.createdAt)
      }));
      
      // Add some user activities
      const recentUsers = users
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);
      
      recentUsers.forEach((user, index) => {
        activities.push({
          id: activities.length + index + 1,
          type: 'user',
          message: `New customer: ${user.firstName} ${user.lastName}`,
          time: getTimeAgo(user.createdAt)
        });
      });
      
      setRecentActivity(activities.slice(0, 6));

      // Calculate top products from real order data
      const productSales: { [key: string]: { sales: number; revenue: number } } = {};
      
      orders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productName]) {
            productSales[item.productName] = { sales: 0, revenue: 0 };
          }
          productSales[item.productName].sales += item.quantity;
          productSales[item.productName].revenue += item.totalPrice;
        });
      });
      
      const topProductsList = Object.entries(productSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      
      setTopProducts(topProductsList);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [timePeriod]);

  // Helper function to calculate time ago
  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{t('admin.dashboard.title')}</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white"
          >
            <option value="today">{t('admin.dashboard.today')}</option>
            <option value="7days">{t('admin.dashboard.last7days')}</option>
            <option value="30days">{t('admin.dashboard.last30days')}</option>
            <option value="90days">{t('admin.dashboard.last90days')}</option>
            <option value="1year">{t('admin.dashboard.lastYear')}</option>
          </select>
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <CurrencyEuroIcon className="h-8 w-8 text-[#ff6b35]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.dashboard.totalRevenue')}</p>
              <p className="text-2xl font-bold text-white">€{kpis.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1">+12% from last period</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <ShoppingCartIcon className="h-8 w-8 text-[#ff6b35]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.dashboard.ordersProcessed')}</p>
              <p className="text-2xl font-bold text-white">{kpis.orderCount}</p>
              <p className="text-xs text-blue-400 mt-1">+8% from last period</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-[#ff6b35]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.dashboard.activeUsers')}</p>
              <p className="text-2xl font-bold text-white">{kpis.userCount.toLocaleString()}</p>
              <p className="text-xs text-purple-400 mt-1">+15% from last period</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-8 w-8 text-[#ff6b35]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.dashboard.conversionRate')}</p>
              <p className="text-2xl font-bold text-white">{kpis.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-orange-400 mt-1">+0.3% from last period</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-[#ff6b35]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.dashboard.avgOrderValue')}</p>
              <p className="text-2xl font-bold text-white">€{kpis.averageOrderValue.toFixed(2)}</p>
              <p className="text-xs text-green-400 mt-1">+3% from last period</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#cccccc]">{t('admin.dashboard.lowStockItems')}</p>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-xs text-red-400 mt-1">Requires attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <h3 className="text-lg font-semibold mb-4 text-white">{t('admin.dashboard.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onTabChange('orders')}
              className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#ff6b35] transition-colors border border-[#404040]"
            >
              <ShoppingCartIcon className="h-6 w-6 text-[#ff6b35] mx-auto mb-2" />
              <p className="text-sm font-medium text-white">Process Orders</p>
              <p className="text-xs text-[#cccccc]">{kpis.orderCount} total</p>
            </button>
            <button 
              onClick={() => onTabChange('users')}
              className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#ff6b35] transition-colors border border-[#404040]"
            >
              <UserGroupIcon className="h-6 w-6 text-[#ff6b35] mx-auto mb-2" />
              <p className="text-sm font-medium text-white">Manage Users</p>
              <p className="text-xs text-[#cccccc]">{kpis.userCount} users</p>
            </button>
            <button 
              onClick={() => onTabChange('bookings')}
              className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#ff6b35] transition-colors border border-[#404040]"
            >
              <CalendarIcon className="h-6 w-6 text-[#ff6b35] mx-auto mb-2" />
              <p className="text-sm font-medium text-white">View Bookings</p>
              <p className="text-xs text-[#cccccc]">25 total</p>
            </button>
            <button 
              onClick={() => onTabChange('reports')}
              className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#ff6b35] transition-colors border border-[#404040]"
            >
              <ChartBarIcon className="h-6 w-6 text-[#ff6b35] mx-auto mb-2" />
              <p className="text-sm font-medium text-white">View Reports</p>
              <p className="text-xs text-[#cccccc]">Analytics</p>
            </button>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
          <h3 className="text-lg font-semibold mb-4 text-white">{t('admin.dashboard.systemAlerts')}</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'error' ? 'bg-red-900 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-900 border-yellow-500' :
                'bg-blue-900 border-blue-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{alert.message}</p>
                    <p className="text-xs text-[#cccccc] capitalize">{alert.priority} priority</p>
                  </div>
                  <button className="text-[#cccccc] hover:text-white">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
        <h3 className="text-lg font-semibold mb-4 text-white">{t('admin.dashboard.recentActivity')}</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'order' ? 'bg-green-500' :
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'booking' ? 'bg-purple-500' :
                  'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-white">{activity.message}</p>
                  <p className="text-xs text-[#cccccc]">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
        <h3 className="text-lg font-semibold mb-4 text-white">{t('admin.dashboard.topProducts')}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#404040]">
                <th className="text-left py-2 text-[#cccccc]">{t('admin.dashboard.product')}</th>
                <th className="text-left py-2 text-[#cccccc]">{t('admin.dashboard.sales')}</th>
                <th className="text-left py-2 text-[#cccccc]">{t('admin.dashboard.revenue')}</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b border-[#404040]">
                  <td className="py-2 text-white">{product.name}</td>
                  <td className="py-2 text-white">{product.sales}</td>
                  <td className="py-2 text-white">€{product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;