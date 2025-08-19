import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { productService, Product } from '../services/product.service';

interface CartItemWithDetails {
  productId: string;
  quantity: number;
  product: Product;
}

const CartPage = () => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, clearCart, calculateCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');
  const [cartCalculation, setCartCalculation] = useState<any>(null);

  // Load product details for cart items
  useEffect(() => {
    const loadCartItems = async () => {
      if (items.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            try {
              // First try to get from stored cart products
              const cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '{}');
              if (cartProducts[item.productId]) {
                return {
                  ...item,
                  product: cartProducts[item.productId],
                };
              }
              
              // Then try API
              const product = await productService.getProduct(item.productId);
              return {
                ...item,
                product,
              };
            } catch (err) {
              console.error(`Failed to load product ${item.productId}:`, err);
              const fallbackProduct = {
                id: item.productId,
                name: `Product ${item.productId}`,
                description: 'Product details unavailable',
                price: 5.99,
                image: '/images/placeholder-food.svg',
                sku: item.productId,
                stockQuantity: 1,
                status: 'active' as const,
                isFeatured: false,
                slug: `product-${item.productId}`,
                categoryId: 'cat-1',
                category: 'General'
              };
              
              return {
                ...item,
                product: fallbackProduct,
              };
            }
          })
        );
        
        setCartItems(itemsWithDetails);
      } catch (err: any) {
        setError(err.message || 'Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, [items]);

  // Calculate cart totals
  useEffect(() => {
    const getCartCalculation = async () => {
      if (items.length === 0) {
        setCartCalculation(null);
        return;
      }

      try {
        setCalculating(true);
        const calculation = await calculateCart();
        setCartCalculation(calculation);
      } catch (err) {
        console.error('Failed to calculate cart:', err);
      } finally {
        setCalculating(false);
      }
    };

    getCartCalculation();
  }, [items, calculateCart]);

  if (loading && items.length > 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t('cart.title')}</h1>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-[#404040] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <p className="text-[#cccccc] mb-4 text-lg">{t('cart.empty')}</p>
            <p className="text-[#888888] mb-6">Add some delicious items to your cart to get started!</p>
          </div>
          <Link to="/store">
            <Button variant="primary" className="btn-hover-lift">{t('cart.continue_shopping')}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.productId} className="flex py-6 bg-[#1a1a1a] rounded-lg border border-[#2d2d2d] mb-4 p-4">
                  <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-[#404040]">
                    <img
                      src={item.product.image || item.product.featuredImage || '/images/placeholder-food.svg'}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-food.svg';
                      }}
                    />
                  </div>

                  <div className="ml-6 flex flex-1 flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between text-base font-medium text-white">
                        <div>
                          <h3 className="text-lg">
                            <Link to={`/product/${item.productId}`} className="hover:text-[#ff6b35] transition-colors">{item.product.name}</Link>
                          </h3>
                          <p className="mt-1 text-sm text-[#cccccc]">{item.product.category}</p>
                          {item.product.description && (
                            <p className="mt-2 text-sm text-[#888888] line-clamp-2">{item.product.description}</p>
                          )}
                          <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-[#cccccc]">€{(item.product.price || 0).toFixed(2)} each</span>
                            {item.product.averageRating && (
                              <div className="flex items-center">
                                <span className="text-yellow-400 text-sm">★ {item.product.averageRating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold text-[#ff6b35]">€{((item.product.price || 0) * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-[#888888] mt-1">Total</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <label htmlFor={`quantity-${item.productId}`} className="mr-3 text-[#cccccc] font-medium">{t('cart.quantity')}:</label>
                          <div className="flex items-center border border-[#404040] rounded-lg bg-[#2d2d2d] shadow-sm">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="px-4 py-2 text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-colors rounded-l-lg font-semibold"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              id={`quantity-${item.productId}`}
                              name={`quantity-${item.productId}`}
                              min="1"
                              max={item.product.stockQuantity || 99}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                              className="w-16 px-2 py-2 text-center bg-transparent text-white border-0 focus:outline-none font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, Math.min(item.product.stockQuantity || 99, item.quantity + 1))}
                              className="px-4 py-2 text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-colors rounded-r-lg font-semibold"
                              disabled={item.quantity >= (item.product.stockQuantity || 99)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Stock status */}
                        <div className="text-sm">
                          {(item.product.stockQuantity || 0) > 0 ? (
                            <span className="text-green-400">✓ In Stock ({item.product.stockQuantity} available)</span>
                          ) : (
                            <span className="text-red-400">⚠ Low Stock</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="flex items-center space-x-2 font-medium text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
                        onClick={() => removeItem(item.productId)}
                        aria-label="Remove item"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#2d2d2d] card-hover">
            <h2 className="text-xl font-semibold mb-4 text-white">{t('cart.order_summary')}</h2>
            
            {calculating ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="small" />
              </div>
            ) : cartCalculation ? (
              <>
                <div className="flex justify-between mb-2 text-[#cccccc]">
                  <span>{t('cart.subtotal')}</span>
                  <span className="text-white">€{(cartCalculation.subtotal || 0).toFixed(2)}</span>
                </div>
                {cartCalculation.shippingAmount > 0 && (
                  <div className="flex justify-between mb-2 text-[#cccccc]">
                    <span>{t('cart.shipping')}</span>
                    <span className="text-white">€{(cartCalculation.shippingAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                {cartCalculation.taxAmount > 0 && (
                  <div className="flex justify-between mb-2 text-[#cccccc]">
                    <span>{t('cart.tax')}</span>
                    <span className="text-white">€{(cartCalculation.taxAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                {cartCalculation.discountAmount > 0 && (
                  <div className="flex justify-between mb-2 text-green-400">
                    <span>{t('cart.discount')}</span>
                    <span>-€{(cartCalculation.discountAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-[#2d2d2d] my-4"></div>
                <div className="flex justify-between font-bold text-lg text-white">
                  <span>{t('cart.total')}</span>
                  <span className="text-[#ff6b35]">€{(cartCalculation.totalAmount || 0).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between mb-2 text-[#cccccc]">
                <span>{t('cart.subtotal')}</span>
                <span className="text-white">€{cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toFixed(2)}</span>
              </div>
            )}
            
            <div className="mt-6 space-y-3">
              <Link to="/checkout">
                <Button 
                  variant="primary" 
                  className="w-full btn-hover-lift"
                  disabled={calculating || cartItems.length === 0}
                >
                  {calculating ? 'Calculating...' : t('cart.proceed_to_checkout')}
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  if (window.confirm(t('cart.clear_confirmation'))) {
                    clearCart();
                  }
                }}
                disabled={calculating || cartItems.length === 0}
                aria-label="Clear cart"
              >
                {t('cart.clear_cart')}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CartPage; 