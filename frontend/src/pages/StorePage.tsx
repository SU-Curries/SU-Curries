import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/store/ProductGrid';
import CategoryFilter from '../components/store/CategoryFilter';
import Input from '../components/common/Input';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { productService, Product, Category } from '../services/product.service';
import { useTranslation } from 'react-i18next';

const StorePage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
      } catch (err: any) {
        console.error('Failed to load categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  // Load products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await productService.getProducts({
          page: currentPage,
          limit: productsPerPage,
          search: searchTerm || undefined,
          categoryId: selectedCategory || undefined,
        });
        
        setProducts(response.products);
        setTotalProducts(response.total);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [currentPage, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);



  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-1/4">
            <div className="bg-primary-bg rounded-lg p-6 border border-secondary-bg sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-text-primary">{t('store.filters')}</h2>
              <div className="mb-6">
                <Input
                  type="search"
                  placeholder={t('store.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#2d2d2d] border-[#404040] text-white placeholder-[#888888] focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                />
              </div>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                loading={categoriesLoading}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="w-3/4">
            {error && <Alert type="error" message={error} className="mb-6" />}
            
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-text-primary">{t('store.title')}</h1>
              <p className="text-text-secondary">
                {t('store.showing_results', { total: totalProducts })}
              </p>
            </div>

            <ProductGrid
              products={products}
              loading={loading}
              error={error}
            />
                
            {totalPages > 1 && !loading && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StorePage; 