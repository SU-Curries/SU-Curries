/**
 * Category Filter Component
 * Allows users to filter products by category
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  loading?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  loading = false
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-300 rounded w-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-text-primary mb-4">
        {t('store.filter_by_category')}
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-accent-color text-white'
              : 'bg-secondary-bg text-text-secondary hover:bg-accent-color/10 hover:text-accent-color'
          }`}
        >
          {t('store.all_categories')}
        </button>
        {Array.isArray(categories) && categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-accent-color text-white'
                : 'bg-secondary-bg text-text-secondary hover:bg-accent-color/10 hover:text-accent-color'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;