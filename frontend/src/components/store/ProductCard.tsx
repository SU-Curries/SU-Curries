import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Toast from '../common/Toast';
import LazyImage from '../common/LazyImage';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { Product as ProductType } from '../../services/product.service';
import { useTranslation } from 'react-i18next';

// Re-export the Product type for other components
export type Product = ProductType;

type ProductCardProps = {
  product: ProductType;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load:', product.image || product.featuredImage);
    setImageError(true);
    // Set fallback image
    (e.target as HTMLImageElement).src = '/images/placeholder-food.svg';
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      console.log('Adding product to cart:', product);
      addItem(product, 1);
      setShowToast(true);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="flex flex-col h-full bg-[#1a1a1a] border-[#2d2d2d] card-hover">
      <div className="relative h-32">
        <LazyImage
          src={product.image || product.featuredImage || '/images/placeholder-food.svg'}
          alt={product.name}
          className="w-full h-full"
          fallback="/images/placeholder-food.svg"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-2 right-2 bg-[#ff6b35] text-white text-xs px-2 py-1 rounded-full shadow-lg">
          {product.category || 'Product'}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
        <p className="text-[#cccccc] mb-4 flex-grow line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-[#ff6b35]">€{(product.price || 0).toFixed(2)}</p>
          <div className="flex items-center">
            <span className="text-yellow-400 text-sm">★ {(product.rating || product.averageRating || 0).toFixed(1)}</span>
          </div>
        </div>
        
        {/* Stock Status */}
        <div className="mb-3">
          {(product.inStock !== false && (product.stockQuantity || 0) > 0) ? (
            <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">In Stock</span>
          ) : (
            <span className="text-red-400 text-xs bg-red-400/10 px-2 py-1 rounded-full">Out of Stock</span>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 mt-auto">
          <Button 
            variant="primary" 
            className="w-full btn-hover-lift flex items-center justify-center" 
            onClick={handleAddToCart}
            disabled={isAdding || (product.inStock === false)}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            {isAdding ? t('common.adding') : t('store.add_to_cart')}
          </Button>
          <Link to={`/product/${product.id}`} className="w-full">
            <Button variant="secondary" className="w-full text-center">{t('store.view_details')}</Button>
          </Link>
        </div>
      </div>

      {/* Add to Cart Toast */}
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        product={product}
        quantity={1}
      />
    </Card>
  );
};

export default ProductCard; 