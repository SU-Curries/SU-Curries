import React, { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import SlidePanel from './common/SlidePanel';
import ConfirmModal from '../common/ConfirmModal';
import NotificationModal from '../common/NotificationModal';
import OrderStatusModal from './OrderStatusModal';
import { orderService, Order } from '../../services/order.service';
import { dataStore } from '../../store/dataStore';
import { 
  EyeIcon, 
  PencilIcon, 
  PrinterIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  
  // Modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  
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
    loadOrders();
    
    // Subscribe to data store changes
    const unsubscribe = dataStore.subscribe(() => {
      loadOrders();
    });
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, dateFilter, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAdminOrders();
      setOrders(response.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = useCallback(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, dateFilter, orders]);

  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-900 text-yellow-300 border-yellow-500';
      case 'Processing': return 'bg-blue-900 text-blue-300 border-blue-500';
      case 'Shipped': return 'bg-purple-900 text-purple-300 border-purple-500';
      case 'Delivered': return 'bg-green-900 text-green-300 border-green-500';
      case 'Cancelled': return 'bg-red-900 text-red-300 border-red-500';
      default: return 'bg-gray-900 text-gray-300 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <ClockIcon className="h-4 w-4" />;
      case 'Processing': return <ArrowPathIcon className="h-4 w-4 animate-spin" />;
      case 'Shipped': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Delivered': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Cancelled': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };



  const viewOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrderDetails({
        ...order,
        items: order.items || [],
        customerDetails: {
          email: 'customer@example.com', // You might want to add email to Order interface
          phone: order.shippingAddress.phone || 'N/A',
          address: `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
        },
        timeline: [
          { status: 'Order Placed', date: new Date(order.createdAt).toLocaleDateString(), time: new Date(order.createdAt).toLocaleTimeString() },
          { status: 'Payment Confirmed', date: new Date(order.createdAt).toLocaleDateString(), time: new Date(order.createdAt).toLocaleTimeString() },
          { status: 'Processing', date: new Date(order.updatedAt).toLocaleDateString(), time: new Date(order.updatedAt).toLocaleTimeString() }
        ]
      });
      setShowOrderPanel(true);
    }
  };

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(null);

  const editOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    setSelectedOrderForStatus(order);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: any) => {
    try {
      await orderService.updateOrder(orderId, { status: newStatus });
      setShowStatusModal(false);
      setSelectedOrderForStatus(null);
      setNotificationModal({
        isOpen: true,
        title: 'Success',
        message: 'Order status updated successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      setNotificationModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update order status',
        type: 'error'
      });
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedOrders.length === 0) {
      setNotificationModal({
        isOpen: true,
        title: 'No Selection',
        message: 'Please select orders first',
        type: 'warning'
      });
      return;
    }

    switch (action) {
      case 'mark-processing':
        setConfirmModal({
          isOpen: true,
          title: 'Mark as Processing',
          message: `Mark ${selectedOrders.length} orders as processing?`,
          type: 'info',
          onConfirm: () => {
            setLoading(true);
            setTimeout(() => {
              setOrders(prev => prev.map(order => 
                selectedOrders.includes(order.id) ? { ...order, status: 'processing' } : order
              ));
              setSelectedOrders([]);
              setLoading(false);
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
              setNotificationModal({
                isOpen: true,
                title: 'Success',
                message: `${selectedOrders.length} orders marked as processing`,
                type: 'success'
              });
            }, 1000);
          }
        });
        break;
      case 'mark-shipped':
        setConfirmModal({
          isOpen: true,
          title: 'Mark as Shipped',
          message: `Mark ${selectedOrders.length} orders as shipped?`,
          type: 'info',
          onConfirm: () => {
            setLoading(true);
            setTimeout(() => {
              setOrders(prev => prev.map(order => 
                selectedOrders.includes(order.id) ? { ...order, status: 'shipped' } : order
              ));
              setSelectedOrders([]);
              setLoading(false);
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
              setNotificationModal({
                isOpen: true,
                title: 'Success',
                message: `${selectedOrders.length} orders marked as shipped`,
                type: 'success'
              });
            }, 1000);
          }
        });
        break;
      case 'export':
        setNotificationModal({
          isOpen: true,
          title: 'Export Started',
          message: 'Exporting selected orders...',
          type: 'info'
        });
        break;
      case 'print':
        setNotificationModal({
          isOpen: true,
          title: 'Print Started',
          message: 'Printing selected orders...',
          type: 'info'
        });
        break;
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length 
        ? [] 
        : filteredOrders.map(order => order.id)
    );
  };

  const printOrder = (id: string) => {
    setNotificationModal({
      isOpen: true,
      title: 'Print Order',
      message: `Printing order ${id}...`,
      type: 'info'
    });
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Orders Management</h2>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export All
          </Button>
          <Button variant="primary" className="flex items-center">
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#2d2d2d] p-4 rounded-lg shadow border border-[#404040]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white placeholder-[#cccccc]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <div className="text-sm text-[#cccccc] flex items-center">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-[#ff6b35]/20 p-4 rounded-lg border border-[#ff6b35]">
          <div className="flex items-center justify-between">
            <span className="text-white">{selectedOrders.length} orders selected</span>
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="small" 
                onClick={() => handleBulkAction('mark-processing')}
                disabled={loading}
              >
                Mark Processing
              </Button>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={() => handleBulkAction('mark-shipped')}
                disabled={loading}
              >
                Mark Shipped
              </Button>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={() => handleBulkAction('print')}
                disabled={loading}
              >
                <PrinterIcon className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={() => handleBulkAction('export')}
                disabled={loading}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#2d2d2d] shadow overflow-hidden sm:rounded-md border border-[#404040]">
        <table className="min-w-full divide-y divide-[#404040]">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#404040] bg-[#1a1a1a] text-[#ff6b35]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#2d2d2d] divide-y divide-[#404040]">
            {filteredOrders.map((order) => (
              <tr key={order.id} className={selectedOrders.includes(order.id) ? 'bg-[#1a1a1a]' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="rounded border-[#404040] bg-[#1a1a1a] text-[#ff6b35]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </div>
                    <div className="text-sm text-[#cccccc]">Customer</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {order.items?.length || 0} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  €{(order.totalAmount || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-1">
                    <Button 
                      variant="secondary" 
                      size="small" 
                      onClick={() => viewOrder(order.id)}
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => editOrder(order.id)}
                      title="Update Status"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => printOrder(order.id)}
                      title="Print Invoice"
                    >
                      <PrinterIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#cccccc] text-lg">No orders found</div>
            <div className="text-[#cccccc] text-sm mt-2 opacity-70">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>

      {/* Order Details Slide Panel */}
      <SlidePanel
        isOpen={showOrderPanel}
        onClose={() => setShowOrderPanel(false)}
        title={`Order ${selectedOrderDetails?.orderNumber}`}
        width="lg"
      >
        {selectedOrderDetails && (
          <div className="space-y-6">
            {/* Customer Section */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Customer</h4>
              <div className="space-y-2">
                <p className="text-white font-medium">{selectedOrderDetails.customer}</p>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-[#ff6b35] hover:text-[#ff6b35]/80">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    {selectedOrderDetails.customerDetails.email}
                  </button>
                  <button className="flex items-center text-[#ff6b35] hover:text-[#ff6b35]/80">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {selectedOrderDetails.customerDetails.phone}
                  </button>
                </div>
                <p className="text-[#cccccc] text-sm">{selectedOrderDetails.customerDetails.address}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Items</h4>
              <div className="space-y-2">
                {selectedOrderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-[#2d2d2d] rounded">
                    <div>
                      <span className="text-white">{item.name}</span>
                      <span className="text-[#cccccc] ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-[#ff6b35]">€{(item.total || item.totalPrice || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#404040] mt-4 pt-4">
                <div className="flex justify-between items-center text-white font-semibold">
                  <span>Total:</span>
                  <span className="text-[#ff6b35]">€{(selectedOrderDetails.total || selectedOrderDetails.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment & Status */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Payment & Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#cccccc]">Payment Method:</span>
                  <span className="text-white">{selectedOrderDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#cccccc]">Status:</span>
                  <select
                    value={selectedOrderDetails.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setOrders(prev => prev.map(order => 
                        order.id === selectedOrderDetails.id ? { ...order, status: newStatus as any } : order
                      ));
                      setSelectedOrderDetails((prev: any) => ({ ...prev, status: newStatus }));
                    }}
                    className="px-2 py-1 bg-[#2d2d2d] border border-[#404040] rounded text-white text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Timeline</h4>
              <div className="space-y-3">
                {selectedOrderDetails.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#ff6b35] rounded-full"></div>
                    <div>
                      <p className="text-white text-sm">{event.status}</p>
                      <p className="text-[#cccccc] text-xs">{event.date} at {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button variant="secondary" size="small" className="flex-1">
                <PrinterIcon className="h-4 w-4 mr-1" />
                Print Invoice
              </Button>
              <Button variant="secondary" size="small" className="flex-1">
                Process Refund
              </Button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        loading={loading}
      />

      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
      />

      {selectedOrderForStatus && (
        <OrderStatusModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedOrderForStatus(null);
          }}
          onUpdateStatus={handleStatusUpdate}
          orderId={selectedOrderForStatus.id}
          currentStatus={selectedOrderForStatus.status}
          orderNumber={selectedOrderForStatus.orderNumber}
        />
      )}
    </div>
  );
};

export default OrdersManagement;