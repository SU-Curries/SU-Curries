import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Button from './Button';
import { Product } from '../../services/product.service';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  quantity: number;
  type?: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({
  isOpen,
  onClose,
  product,
  quantity,
  type = 'success'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg shadow-xl max-w-sm w-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Added to Cart!</span>
            </div>
            <button
              onClick={handleClose}
              className="text-[#888888] hover:text-white transition-colors focus:outline-none active:outline-none"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={product.image || product.featuredImage || '/images/placeholder-food.svg'}
              alt={product.name}
              className="w-10 h-10 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-food.svg';
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm truncate">{product.name}</h4>
              <p className="text-[#cccccc] text-xs">Qty: {quantity} • €{(product.price * quantity).toFixed(2)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="flex-1 px-3 py-2 text-xs bg-[#2d2d2d] text-[#cccccc] rounded hover:bg-[#404040] transition-colors focus:outline-none active:outline-none"
            >
              Continue
            </button>
            <Link to="/cart" className="flex-1">
              <Button
                variant="primary"
                size="small"
                className="w-full text-xs flex items-center justify-center"
              >
                <ShoppingCartIcon className="w-3 h-3 mr-1" />
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;