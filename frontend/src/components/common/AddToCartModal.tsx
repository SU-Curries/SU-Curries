import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, CheckCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import { Product } from '../../services/product.service';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  quantity: number;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  product,
  quantity
}) => {
  // Auto-close after 3 seconds to reduce interruption
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with smooth transition */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#888888] hover:text-white transition-colors focus:outline-none active:outline-none"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10 text-green-400" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white text-center mb-4">
              Added to Cart!
            </h3>

            {/* Product Info */}
            <div className="flex items-center space-x-3 mb-6 p-3 bg-[#2d2d2d] rounded-lg">
              <img
                src={product.image || product.featuredImage || '/images/placeholder-food.svg'}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-food.svg';
                }}
              />
              <div className="flex-1">
                <h4 className="text-white font-medium">{product.name}</h4>
                <p className="text-[#cccccc] text-sm">Quantity: {quantity}</p>
                <p className="text-[#ff6b35] font-semibold">€{(product.price * quantity).toFixed(2)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Continue Shopping
              </Button>
              <Link to="/cart" className="flex-1">
                <Button
                  variant="primary"
                  className="w-full btn-hover-lift flex items-center justify-center"
                >
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;