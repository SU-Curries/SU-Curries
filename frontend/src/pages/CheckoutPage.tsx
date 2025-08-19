import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, cartCalculation, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect if cart is empty
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-primary-bg text-text-primary p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{t('checkout.empty_cart')}</h1>
          <p className="text-text-secondary mb-6">{t('checkout.continue_shopping')}</p>
          <Button onClick={() => navigate('/store')} variant="primary">
            {t('checkout.continue_shopping')}
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    
    // Apply field-specific validation and formatting
    switch (field) {
      case 'cardNumber':
        // Remove non-digits and limit to 16 characters
        processedValue = value.replace(/\D/g, '').slice(0, 16);
        // Format as groups of 4
        processedValue = processedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
        break;
      case 'expiryDate':
        // Remove non-digits and limit to 4 characters (MMYY)
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 2) {
          processedValue = digits.slice(0, 2) + '/' + digits.slice(2);
        } else {
          processedValue = digits;
        }
        break;
      case 'cvc':
        // Remove non-digits and limit to 3 characters
        processedValue = value.replace(/\D/g, '').slice(0, 3);
        break;
      case 'postalCode':
        // Limit to 10 characters
        processedValue = value.slice(0, 10);
        break;
      default:
        break;
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order with current form data
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          id: 'addr-new',
          firstName: user?.firstName || 'Customer',
          lastName: user?.lastName || 'Name',
          addressLine1: formData.streetAddress,
          city: formData.city,
          state: formData.city, // Using city as state for simplicity
          postalCode: formData.postalCode,
          country: 'Germany',
          phone: user?.phone || '+49123456789'
        },
        billingAddress: {
          id: 'addr-new',
          firstName: user?.firstName || 'Customer',
          lastName: user?.lastName || 'Name',
          addressLine1: formData.streetAddress,
          city: formData.city,
          state: formData.city,
          postalCode: formData.postalCode,
          country: 'Germany',
          phone: user?.phone || '+49123456789'
        },
        paymentMethod: 'credit_card',
        notes: 'Order placed via web checkout'
      };

      // Create the order
      const newOrder = {
        id: `order-${Date.now()}`,
        orderNumber: `ORD-${Date.now()}`,
        status: 'pending' as const,
        items: items.map(item => ({
          productId: item.productId,
          productName: `Product ${item.productId}`, // You might want to get actual product name
          quantity: item.quantity,
          price: 10.99, // You might want to get actual price
          totalPrice: 10.99 * item.quantity
        })),
        subtotal: cartCalculation?.subtotal || 0,
        taxAmount: cartCalculation?.taxAmount || 0,
        shippingAmount: cartCalculation?.shippingAmount || 0,
        discountAmount: 0,
        totalAmount: cartCalculation?.totalAmount || 0,
        currency: 'EUR',
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: 'paid' as const,
        notes: orderData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to centralized data store
      const { dataStore } = await import('../store/dataStore');
      dataStore.addOrder(newOrder);

      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t('checkout.title')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2d2d2d]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">{t('checkout.shipping_address')}</h2>
                <div className="space-y-4">
                  <Input
                    label="Street Address"
                    type="text"
                    value={formData.streetAddress}
                    onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                    required
                    aria-describedby="street-help"
                  />
                  <div id="street-help" className="text-sm text-text-secondary">
                    Enter your full street address
                  </div>
                  
                  <Input
                    label="City"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    aria-describedby="city-help"
                  />
                  <div id="city-help" className="text-sm text-text-secondary">
                    Enter your city name
                  </div>
                  
                  <Input
                    label="Postal Code"
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    required
                    aria-describedby="postal-help"
                  />
                  <div id="postal-help" className="text-sm text-text-secondary">
                    Enter your postal/ZIP code
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">{t('checkout.payment_method')}</h2>
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    maxLength={19}
                    required
                    aria-describedby="card-help"
                  />
                  <div id="card-help" className="text-sm text-text-secondary">
                    Enter your 16-digit card number
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Expiry Date"
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        maxLength={5}
                        required
                        aria-describedby="expiry-help"
                      />
                      <div id="expiry-help" className="text-sm text-text-secondary mt-1">
                        Month and year only
                      </div>
                    </div>
                    <div>
                      <Input
                        label="CVC"
                        type="text"
                        placeholder="123"
                        value={formData.cvc}
                        onChange={(e) => handleInputChange('cvc', e.target.value)}
                        maxLength={3}
                        required
                        aria-describedby="cvc-help"
                      />
                      <div id="cvc-help" className="text-sm text-text-secondary mt-1">
                        3-digit security code
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" /> : t('checkout.place_order')}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2d2d2d]">
            <h2 className="text-xl font-semibold text-white mb-4">{t('checkout.order_summary')}</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div>
                    <span className="text-white">Product {item.productId}</span>
                    <span className="text-text-secondary ml-2">x{item.quantity}</span>
                  </div>
                  <span className="text-[#ff6b35]">€{(10.99 * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-[#2d2d2d] pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('checkout.subtotal')}</span>
                <span className="text-white">€{cartCalculation?.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('checkout.shipping')}</span>
                <span className="text-white">€{cartCalculation?.shippingAmount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('checkout.tax')}</span>
                <span className="text-white">€{cartCalculation?.taxAmount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-[#2d2d2d] pt-2">
                <span className="text-white">{t('checkout.total')}</span>
                <span className="text-[#ff6b35]">€{cartCalculation?.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;