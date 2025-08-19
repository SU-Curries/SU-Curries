import React, { useState, useEffect } from 'react';
import { dataStore } from '../store/dataStore';
import { Order, OrderStatus } from '../services/order.service';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  TruckIcon, 
  MapPinIcon, 
  PhoneIcon, 
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const DriverDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadOrders();
    
    // Subscribe to data store changes
    const unsubscribe = dataStore.subscribe(() => {
      loadOrders();
    });
    
    return unsubscribe;
  }, []);

  const loadOrders = () => {
    try {
      setLoading(true);
      // Get orders that are ready for delivery (shipped status)
      const deliveryOrders = dataStore.getOrdersForDelivery();
      setOrders(deliveryOrders);
    } catch (error) {
      console.error('Failed to load delivery orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = (orderId: string) => {
    const notes = deliveryNotes[orderId] || '';
    const success = dataStore.markOrderAsDelivered(orderId, notes);
    
    if (success) {
      // Clear the notes for this order
      setDeliveryNotes(prev => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
      
      // Show success message (you could add a toast notification here)
      alert(`Order ${orderId} marked as delivered successfully!`);
    } else {
      alert('Failed to update order status');
    }
  };

  const handleNotesChange = (orderId: string, notes: string) => {
    setDeliveryNotes(prev => ({
      ...prev,
      [orderId]: notes
    }));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center">
              <TruckIcon className="h-8 w-8 mr-3 text-accent-color" />
              Driver Dashboard
            </h1>
            <p className="text-text-secondary mt-2">Manage your delivery orders</p>
          </div>
          <Button
            variant="secondary"
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-primary-bg border-secondary-bg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-secondary">Ready for Delivery</p>
                <p className="text-2xl font-bold text-text-primary">{orders.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-primary-bg border-secondary-bg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-secondary">Delivered Today</p>
                <p className="text-2xl font-bold text-text-primary">
                  {dataStore.getOrdersByStatus('delivered').filter(order => {
                    const today = new Date().toDateString();
                    return new Date(order.updatedAt).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-primary-bg border-secondary-bg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-secondary">Pending Pickup</p>
                <p className="text-2xl font-bold text-text-primary">
                  {dataStore.getOrdersByStatus('processing').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="p-12 text-center bg-primary-bg border-secondary-bg">
            <TruckIcon className="h-16 w-16 text-border-color mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">No Deliveries Available</h2>
            <p className="text-text-secondary">All orders have been delivered or are not ready for delivery yet.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 bg-primary-bg border-secondary-bg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer & Delivery Info */}
                  <div>
                    <h4 className="font-medium text-text-primary mb-3 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Delivery Address
                    </h4>
                    <div className="bg-secondary-bg p-4 rounded-lg">
                      <p className="font-medium text-text-primary">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-text-secondary">{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p className="text-text-secondary">{order.shippingAddress.addressLine2}</p>
                      )}
                      <p className="text-text-secondary">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-text-secondary">{order.shippingAddress.country}</p>
                      
                      {order.shippingAddress.phone && (
                        <div className="mt-2 flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-2 text-accent-color" />
                          <a 
                            href={`tel:${order.shippingAddress.phone}`}
                            className="text-accent-color hover:underline"
                          >
                            {order.shippingAddress.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-text-primary mb-3">Order Items</h4>
                    <div className="bg-secondary-bg p-4 rounded-lg">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-border-color last:border-b-0">
                          <div>
                            <p className="text-text-primary">{item.productName}</p>
                            <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-text-primary">€{(item.totalPrice || 0).toFixed(2)}</p>
                        </div>
                      ))}
                      <div className="mt-3 pt-3 border-t border-border-color">
                        <div className="flex justify-between items-center font-semibold">
                          <span className="text-text-primary">Total:</span>
                          <span className="text-accent-color">€{(order.totalAmount || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    value={deliveryNotes[order.id] || ''}
                    onChange={(e) => handleNotesChange(order.id, e.target.value)}
                    placeholder="Add any delivery notes (e.g., left at door, handed to customer, etc.)"
                    className="w-full px-3 py-2 bg-secondary-bg border border-border-color rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-accent-color"
                    rows={3}
                  />
                </div>

                {/* Action Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => handleMarkAsDelivered(order.id)}
                    className="flex items-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;