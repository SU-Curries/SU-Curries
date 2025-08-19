import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { productService, Product } from '../../services/product.service';
import LoadingSpinner from '../common/LoadingSpinner';

interface CartItemWithDetails {
  productId: string;
  quantity: number;
  product: Product;
}

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { t } = useTranslation();
  const { items, removeItem, cartCalculation, calculateCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

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
              };
              
              return {
                ...item,
                product: fallbackProduct,
              };
            }
          })
        );
        
        setCartItems(itemsWithDetails);
      } catch (err) {
        console.error('Failed to load cart items:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadCartItems();
      calculateCart();
    }
  }, [items, isOpen, calculateCart]);

  const subtotal = cartCalculation?.subtotal ?? 
    cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-primary-bg shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-text-primary">
                          {t('cart.shopping_cart')}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none active:outline-none"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">{t('common.close')}</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        {loading ? (
                          <div className="flex justify-center py-12">
                            <LoadingSpinner size="medium" />
                          </div>
                        ) : items.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-text-secondary">{t('cart.empty')}</p>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-border-color">
                              {cartItems.map((item) => (
                                <li key={item.productId} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border-color">
                                    <img
                                      src={item.product?.image || item.product?.featuredImage || '/images/placeholder-food.svg'}
                                      alt={item.product?.name || 'Product'}
                                      className="h-full w-full object-cover object-center"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (target.src !== '/images/placeholder-food.svg') {
                                          target.src = '/images/placeholder-food.svg';
                                        }
                                      }}
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-text-primary">
                                        <h3>
                                          <Link to={`/product/${item.productId}`} onClick={onClose}>
                                            {item.product?.name || 'Unknown Product'}
                                          </Link>
                                        </h3>
                                        <p className="ml-4">€{((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                                      </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-text-secondary">{t('cart.qty')} {item.quantity}</p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-accent-color hover:text-opacity-80 focus:outline-none active:outline-none"
                                          onClick={() => removeItem(item.productId)}
                                        >
                                          {t('cart.remove')}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-border-color px-4 py-6 sm:px-6">
                      {items.length > 0 && (
                        <>
                          <div className="flex justify-between text-base font-medium text-text-primary">
                            <p>{t('cart.subtotal')}</p>
                            <p>€{(subtotal || 0).toFixed(2)}</p>
                          </div>
                          <p className="mt-0.5 text-sm text-text-secondary">
                            {t('cart.shipping_note')}
                          </p>
                          <div className="mt-6">
                            <Link to="/cart" onClick={onClose}>
                              <Button variant="secondary" className="w-full mb-2">
                                {t('cart.view_cart')}
                              </Button>
                            </Link>
                            <Link to="/checkout" onClick={onClose}>
                              <Button variant="primary" className="w-full">
                                {t('cart.checkout')}
                              </Button>
                            </Link>
                          </div>
                        </>
                      )}
                      <div className="mt-6 flex justify-center text-center text-sm text-text-secondary">
                        <p>
                          {items.length > 0 ? t('cart.or') + ' ' : ''}
                          <button
                            type="button"
                            className="font-medium text-accent-color hover:text-opacity-80 focus:outline-none active:outline-none"
                            onClick={onClose}
                          >
                            {t('cart.continue_shopping')} <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartSidebar; 