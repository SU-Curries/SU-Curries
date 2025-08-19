import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { orderService, CartItem, CartCalculation } from '../services/order.service';
import { Product } from '../services/product.service';

interface CartContextType {
  items: CartItem[];
  cartCalculation: CartCalculation | null;
  loading: boolean;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateCart: () => Promise<CartCalculation>;
  itemCount: number;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  cartCalculation: null,
  loading: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  calculateCart: async () => ({ 
    items: [], 
    subtotal: 0, 
    taxAmount: 0, 
    shippingAmount: 0, 
    discountAmount: 0, 
    totalAmount: 0, 
    currency: 'EUR' 
  }),
  itemCount: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartCalculation, setCartCalculation] = useState<CartCalculation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Calculate total item count
  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  // Add item to cart
  const addItem = useCallback((product: Product, quantity: number) => {
    console.log('Adding item to cart:', product, quantity);
    
    // Store product data in localStorage for cart persistence
    const cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '{}');
    cartProducts[product.id] = product;
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { productId: product.id, quantity }];
      }
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => {
      return prevItems.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  }, [removeItem]);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    setCartCalculation(null);
  }, []);

  // Calculate cart totals from API
  const calculateCart = useCallback(async () => {
    if (items.length === 0) {
      setCartCalculation(null);
      return { 
        items: [], 
        subtotal: 0, 
        taxAmount: 0, 
        shippingAmount: 0, 
        discountAmount: 0, 
        totalAmount: 0, 
        currency: 'EUR' 
      };
    }
    
    try {
      setLoading(true);
      const calculation = await orderService.calculateCart({ items });
      setCartCalculation(calculation);
      return calculation;
    } catch (error) {
      console.error('Failed to calculate cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [items]);

  // Memoize context value
  const value = useMemo(
    () => ({
      items,
      cartCalculation,
      loading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      calculateCart,
      itemCount,
    }),
    [items, cartCalculation, loading, addItem, removeItem, updateQuantity, clearCart, calculateCart, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};