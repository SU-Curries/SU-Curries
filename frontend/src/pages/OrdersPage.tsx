import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService, Order } from '../services/order.service';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { EyeIcon, TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { dataStore } from '../store/dataStore';

const OrdersPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
    
    // Subscribe to data store changes
    const unsubscribe = dataStore.subscribe(() => {
      if (isAuthenticated) {
        loadOrders();
      }
    });
    
    return unsubscribe;
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await orderService.getUserOrders();
      setOrders(userOrders);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20';
      case 'processing': return 'bg-blue-400/10 text-blue-400 border border-blue-400/20';
      case 'shipped': return 'bg-purple-400/10 text-purple-400 border border-purple-400/20';
      case 'delivered': return 'bg-green-400/10 text-green-400 border border-green-400/20';
      case 'cancelled': return 'bg-red-400/10 text-red-400 border border-red-400/20';
      default: return 'bg-secondary-bg/10 text-text-secondary border border-secondary-bg/20';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Please Log In</h1>
          <p className="text-text-secondary mb-6">You need to be logged in to view your orders.</p>
          <Link to="/login">
            <Button variant="primary" className="btn-hover-lift">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">My Orders</h1>
            <p className="text-text-secondary mt-2">Track and manage your orders</p>
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

        {error && (
          <div className="mb-6 bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <TruckIcon className="h-16 w-16 text-border-color mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">No Orders Yet</h2>
            <p className="text-text-secondary mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link to="/store">
              <Button variant="primary" className="btn-hover-lift">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-primary-bg border border-secondary-bg shadow-lg rounded-lg overflow-hidden card-hover">
                <div className="px-6 py-4 border-b border-secondary-bg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-lg font-semibold text-text-primary mt-1">
                        €{(order.totalAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-text-secondary">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="text-text-primary">€{(item.totalPrice || 0).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items && order.items.length > 3 && (
                          <p className="text-sm text-border-color">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-text-primary mb-2">Delivery Address</h4>
                      <div className="text-sm text-text-secondary">
                        <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && (
                          <p>{order.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm">
                      {order.status === 'delivered' && (
                        <span className="text-green-400">✓ Delivered</span>
                      )}
                      {order.status === 'shipped' && (
                        <span className="text-blue-400">📦 In Transit</span>
                      )}
                      {order.status === 'processing' && (
                        <span className="text-yellow-400">⏳ Processing</span>
                      )}
                      {order.status === 'pending' && (
                        <span className="text-text-secondary">⏳ Order Confirmed</span>
                      )}
                    </div>

                    <Link to={`/orders/${order.id}`}>
                      <Button variant="secondary" size="small" className="flex items-center btn-hover-lift">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;