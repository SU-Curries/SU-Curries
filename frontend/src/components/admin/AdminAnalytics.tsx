import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dataStore } from '../../store/dataStore';

interface AnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'order' | 'user' | 'booking';
    description: string;
    timestamp: Date;
  }>;
  salesChart: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Get real data from dataStore
      const stats = dataStore.getOrderStats();
      const users = dataStore.getUsers();
      const orders = dataStore.getOrders();
      
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
      
      const topProducts = Object.entries(productSales)
        .map(([name, data], index) => ({ 
          id: `prod-${index + 1}`, 
          name, 
          sales: data.sales,
          revenue: data.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Generate recent activity from real data
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      
      const recentUsers = users
        .filter(u => u.role === 'customer')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);

      const recentActivity = [
        ...recentOrders.map((order, index) => ({
          id: `order-${index}`,
          type: 'order' as const,
          description: `New order ${order.orderNumber} - €${order.totalAmount.toFixed(2)}`,
          timestamp: new Date(order.createdAt),
        })),
        ...recentUsers.map((user, index) => ({
          id: `user-${index}`,
          type: 'user' as const,
          description: `New user registration: ${user.firstName} ${user.lastName}`,
          timestamp: new Date(user.createdAt),
        }))
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);

      // Generate sales chart data from real orders
      const salesChart = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.filter(order => 
          order.createdAt.split('T')[0] === dateStr
        );
        
        return {
          date: dateStr,
          sales: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
          orders: dayOrders.length,
        };
      });

      const realData: AnalyticsData = {
        totalUsers: users.filter(u => u.role === 'customer').length,
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        averageOrderValue: stats.averageOrderValue,
        topProducts,
        recentActivity,
        salesChart,
      };

      setTimeout(() => {
        setAnalytics(realData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-[#cccccc]">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
          className="bg-[#2d2d2d] text-white border border-[#404040] rounded-md px-3 py-2"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] border border-[#404040] rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#cccccc] text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{analytics.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a1a] border border-[#404040] rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#cccccc] text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{analytics.totalOrders.toLocaleString()}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1a1a] border border-[#404040] rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#cccccc] text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">€{analytics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-[#ff6b35]/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-[#ff6b35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1a1a] border border-[#404040] rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#cccccc] text-sm">Avg Order Value</p>
              <p className="text-2xl font-bold text-white">€{analytics.averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1a1a1a] border border-[#404040] rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#ff6b35] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-[#cccccc] text-sm">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">€{product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1a1a1a] border border-[#404040] rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'order' ? 'bg-green-400' :
                  activity.type === 'user' ? 'bg-blue-400' : 'bg-[#ff6b35]'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.description}</p>
                  <p className="text-[#cccccc] text-xs">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sales Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#1a1a1a] border border-[#404040] rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Sales Overview</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-[#404040] rounded-lg">
          <div className="text-center">
            <svg className="w-12 h-12 text-[#666666] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-[#cccccc]">Sales chart would be implemented here</p>
            <p className="text-[#666666] text-sm">Using Chart.js or similar library</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;