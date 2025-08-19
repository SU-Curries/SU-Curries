/**
 * Product Grid Component
 * Displays products in a responsive grid layout
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Product as ServiceProduct } from '../../services/product.service';

interface ProductGridProps {
  products: ServiceProduct[];
  loading?: boolean;
  error?: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error = null
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">{t('store.error_loading_products')}</p>
          <p className="text-sm text-text-secondary mt-2">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent-color text-white rounded-md hover:bg-accent-color/90 transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-secondary mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-lg font-medium text-text-primary">{t('store.no_products_found')}</p>
          <p className="text-sm mt-2">{t('store.try_different_category')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image || '',
            category: product.category,
            sku: product.id.toString(),
            stockQuantity: product.stockQuantity || 0,
            status: 'active' as const,
            isFeatured: false,
            slug: product.name.toLowerCase().replace(/\s+/g, '-'),
            categoryId: (product.categoryId || 1).toString()
          }}
        />
      ))}
    </div>
  );
};

export default ProductGrid;