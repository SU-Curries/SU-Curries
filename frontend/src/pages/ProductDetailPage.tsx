import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import AddToCartModal from '../components/common/AddToCartModal';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { productService, Product } from '../services/product.service';
import { useTranslation } from 'react-i18next';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  // Load product details
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await productService.getProduct(id);
        setProduct(productData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setIsAdding(true);
      addItem(product, quantity);
      setShowAddToCartModal(true);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/images/placeholder-food.svg';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <Alert type="error" message={error || 'Product not found'} />
        <Button 
          variant="secondary" 
          onClick={() => navigate('/store')}
          className="mt-4"
        >
          {t('common.back_to_store')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image Gallery */}
      <div>
        <img
          src={product.image || product.featuredImage || '/images/placeholder-food.svg'}
          alt={product.name}
          className="w-full rounded-lg shadow-lg"
          onError={handleImageError}
        />
        {/* Thumbnails can be added here */}
      </div>

          {/* Product Information */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-2xl text-[#ff6b35] font-semibold mb-4">
              €{(product.price || 0).toFixed(2)}
            </p>
            <p className="text-text-secondary mb-6 leading-relaxed">{product.description}</p>
        
            <div className="flex items-center mb-6">
              <span className="text-yellow-400 text-lg">★ {(product.rating || product.averageRating || 0).toFixed(1)}</span>
              <span className="text-text-secondary ml-2">({product.reviewCount || 0} {t('product.reviews')})</span>
            </div>

            {/* Stock status */}
            <div className="mb-6">
              {(product.inStock !== false && product.stockQuantity > 0) ? (
                <span className="text-green-400 font-medium bg-green-400/10 px-3 py-1 rounded-full">{t('product.in_stock')}</span>
              ) : (
                <span className="text-red-400 font-medium bg-red-400/10 px-3 py-1 rounded-full">{t('product.out_of_stock')}</span>
              )}
            </div>

            <div className="bg-primary-bg p-6 rounded-lg border border-secondary-bg mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <label htmlFor="quantity" className="font-semibold text-text-primary">{t('product.quantity')}:</label>
                <div className="flex items-center border border-[#404040] rounded-md bg-[#2d2d2d]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-colors rounded-l-md"
                    disabled={quantity <= 1 || !product.inStock}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={product.stockQuantity || 99}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-2 text-center bg-transparent text-white border-0 focus:outline-none"
                    disabled={!product.inStock}
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                    className="px-3 py-2 text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-colors rounded-r-md"
                    disabled={quantity >= (product.stockQuantity || 99) || !product.inStock}
                  >
                    +
                  </button>
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={handleAddToCart}
                disabled={(product.inStock === false || product.stockQuantity <= 0) || isAdding}
                className="w-full btn-hover-lift"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                {isAdding ? t('common.adding') : t('product.add_to_cart')}
              </Button>
            </div>

            {/* Product details */}
            <div className="space-y-6">
              {product.ingredients && (
                <div className="bg-primary-bg p-4 rounded-lg border border-secondary-bg">
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">{t('product.ingredients')}</h3>
                  <p className="text-text-secondary">{product.ingredients}</p>
                </div>
              )}
              {product.nutritionalInfo && (
                <div className="bg-primary-bg p-4 rounded-lg border border-secondary-bg">
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">{t('product.nutritional_info')}</h3>
                  <p className="text-text-secondary">{product.nutritionalInfo}</p>
                </div>
              )}
              {product.cookingInstructions && (
                <div className="bg-primary-bg p-4 rounded-lg border border-secondary-bg">
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">{t('product.cooking_instructions')}</h3>
                  <p className="text-text-secondary">{product.cookingInstructions}</p>
                </div>
              )}
              <div className="bg-primary-bg p-4 rounded-lg border border-secondary-bg">
                <h3 className="text-xl font-semibold mb-2 text-text-primary">{t('product.category')}</h3>
                <p className="text-text-secondary">{product.category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Cart Modal */}
        <AddToCartModal
          isOpen={showAddToCartModal}
          onClose={() => setShowAddToCartModal(false)}
          product={product}
          quantity={quantity}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage; 