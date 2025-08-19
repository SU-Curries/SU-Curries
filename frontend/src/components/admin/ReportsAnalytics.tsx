import React, { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon, 
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { analyticsService, SalesAnalytics, CustomerAnalytics } from '../../services/analytics.service';

const ReportsAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null);
  const [customerData, setCustomerData] = useState<CustomerAnalytics | null>(null);
  
  // Modal state
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [activeTab, dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'sales') {
        const data = await analyticsService.getSalesAnalytics(dateRange);
        setSalesData(data);
      } else if (activeTab === 'customers') {
        const data = await analyticsService.getCustomerAnalytics(dateRange);
        setCustomerData(data);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'sales', name: 'Sales Reports', icon: ChartBarIcon },
    { id: 'customers', name: 'Customer Analytics', icon: UserGroupIcon },
    { id: 'inventory', name: 'Inventory Reports', icon: ShoppingBagIcon },
    { id: 'financial', name: 'Financial Reports', icon: CurrencyEuroIcon },
    { id: 'marketing', name: 'Marketing Analytics', icon: ArrowTrendingUpIcon }
  ];

  const exportReport = (type: string) => {
    // Mock export functionality
    setNotificationModal({
      isOpen: true,
      title: 'Export Started',
      message: `Exporting ${type} report...`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <Button 
            variant="secondary" 
            className="flex items-center"
            onClick={() => exportReport('comprehensive')}
            disabled={loading}
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            )}
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#404040]">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#ff6b35] text-[#ff6b35]'
                  : 'border-transparent text-[#cccccc] hover:text-white hover:border-[#404040]'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Sales Reports Tab */}
      {activeTab === 'sales' && salesData && (
        <div className="space-y-6">
          {/* Sales Trend Chart */}
          <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
            <h3 className="text-lg font-semibold mb-4 text-white">Sales Trend</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {salesData.salesTrend.slice(-7).map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-orange-500 rounded-t w-8 min-h-[20px]"
                    style={{ height: `${Math.max(20, (day.revenue / Math.max(...salesData.salesTrend.map(d => d.revenue))) * 200)}px` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2 transform -rotate-45">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs text-white font-medium">
                    €{day.revenue.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
            <h3 className="text-lg font-semibold mb-4 text-white">Category Performance</h3>
            <div className="space-y-4">
              {salesData.categoryPerformance.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">{category.category}</h4>
                    <p className="text-sm text-gray-400">{category.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-500">€{category.revenue.toFixed(2)}</p>
                    <p className="text-xs text-green-400">+{Math.floor(Math.random() * 20)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-[#2d2d2d] p-6 rounded-lg shadow border border-[#404040]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Top Selling Products</h3>
              <Button variant="secondary" size="small" onClick={() => exportReport('products')}>
                Export
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-300">Product</th>
                    <th className="text-left py-2 text-gray-300">Units Sold</th>
                    <th className="text-left py-2 text-gray-300">Revenue</th>
                    <th className="text-left py-2 text-gray-300">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 text-white">{product.name}</td>
                      <td className="py-2 text-white">{product.totalSold}</td>
                      <td className="py-2 text-white">€{product.revenue.toFixed(2)}</td>
                      <td className="py-2">
                        <span className="flex items-center text-green-400">
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                          +{Math.floor(Math.random() * 25)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Analytics Tab */}
      {activeTab === 'customers' && customerData && (
        <div className="space-y-6">
          {/* Customer Acquisition Chart */}
          <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Customer Acquisition Trend</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {customerData.customerAcquisition.slice(-7).map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-8 min-h-[20px]"
                    style={{ height: `${Math.max(20, (day.newCustomers / Math.max(...customerData.customerAcquisition.map(d => d.newCustomers))) * 200)}px` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2 transform -rotate-45">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs text-white font-medium">
                    {day.newCustomers}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Retention Rate</h3>
              <p className="text-3xl font-bold text-green-500">{customerData.customerRetention.retentionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-400">+2.3% from last period</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">New Customers</h3>
              <p className="text-3xl font-bold text-blue-500">{customerData.customerAcquisition.reduce((sum, day) => sum + day.newCustomers, 0)}</p>
              <p className="text-sm text-gray-400">This period</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Avg Customer Value</h3>
              <p className="text-3xl font-bold text-purple-500">€{(customerData.topCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0) / customerData.topCustomers.length).toFixed(2)}</p>
              <p className="text-sm text-gray-400">Per customer</p>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Top Customers</h3>
              <Button variant="secondary" size="small" onClick={() => exportReport('customers')}>
                Export
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-300">Customer</th>
                    <th className="text-left py-2 text-gray-300">Email</th>
                    <th className="text-left py-2 text-gray-300">Orders</th>
                    <th className="text-left py-2 text-gray-300">Total Spent</th>
                    <th className="text-left py-2 text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData.topCustomers.map((customer, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 text-white">{customer.name}</td>
                      <td className="py-2 text-gray-300">{customer.email}</td>
                      <td className="py-2 text-white">{customer.orderCount}</td>
                      <td className="py-2 text-white">€{customer.totalSpent.toFixed(2)}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          customer.orderCount >= 10 ? 'bg-gold-100 text-gold-800' :
                          customer.orderCount >= 5 ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {customer.orderCount >= 10 ? 'VIP' : customer.orderCount >= 5 ? 'Loyal' : 'Regular'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Reports Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Low Stock Items</h3>
              <p className="text-3xl font-bold text-red-500">8</p>
              <p className="text-sm text-gray-400">Require attention</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Out of Stock</h3>
              <p className="text-3xl font-bold text-red-600">3</p>
              <p className="text-sm text-gray-400">Need restock</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Total Products</h3>
              <p className="text-3xl font-bold text-blue-500">156</p>
              <p className="text-sm text-gray-400">Active items</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Inventory Value</h3>
              <p className="text-3xl font-bold text-green-500">€45,230</p>
              <p className="text-sm text-gray-400">Total value</p>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Inventory Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-700 rounded-lg">
                <h4 className="font-medium mb-2 text-white">Stock Levels Report</h4>
                <p className="text-sm text-gray-400">Current inventory status and alerts</p>
                <Button variant="secondary" size="small" className="mt-2" onClick={() => exportReport('stock')}>
                  Generate Report
                </Button>
              </div>
              <div className="p-4 border border-gray-700 rounded-lg">
                <h4 className="font-medium mb-2 text-white">Stock Movement Report</h4>
                <p className="text-sm text-gray-400">Inventory changes and turnover rates</p>
                <Button variant="secondary" size="small" className="mt-2" onClick={() => exportReport('movement')}>
                  Generate Report
                </Button>
              </div>
              <div className="p-4 border border-gray-700 rounded-lg">
                <h4 className="font-medium mb-2 text-white">Reorder Recommendations</h4>
                <p className="text-sm text-gray-400">AI-powered restocking suggestions</p>
                <Button variant="secondary" size="small" className="mt-2" onClick={() => exportReport('reorder')}>
                  Generate Report
                </Button>
              </div>
              <div className="p-4 border border-gray-700 rounded-lg">
                <h4 className="font-medium mb-2 text-white">Supplier Performance</h4>
                <p className="text-sm text-gray-400">Delivery times and quality metrics</p>
                <Button variant="secondary" size="small" className="mt-2" onClick={() => exportReport('suppliers')}>
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Reports Tab */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Gross Revenue</h3>
              <p className="text-3xl font-bold text-green-500">€45,230</p>
              <p className="text-sm text-gray-400">+15% from last period</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Net Profit</h3>
              <p className="text-3xl font-bold text-blue-500">€12,450</p>
              <p className="text-sm text-gray-400">27.5% margin</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Operating Costs</h3>
              <p className="text-3xl font-bold text-orange-500">€32,780</p>
              <p className="text-sm text-gray-400">72.5% of revenue</p>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Analytics Tab */}
      {activeTab === 'marketing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Website Visitors</h3>
              <p className="text-3xl font-bold text-blue-500">12,450</p>
              <p className="text-sm text-gray-400">This period</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Conversion Rate</h3>
              <p className="text-3xl font-bold text-green-500">3.2%</p>
              <p className="text-sm text-gray-400">+0.5% improvement</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Email Open Rate</h3>
              <p className="text-3xl font-bold text-purple-500">24.8%</p>
              <p className="text-sm text-gray-400">Above industry avg</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">Social Engagement</h3>
              <p className="text-3xl font-bold text-orange-500">1,234</p>
              <p className="text-sm text-gray-400">Total interactions</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
      />
    </div>
  );
};

export default ReportsAnalytics;