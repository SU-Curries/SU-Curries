import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/store/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { HeartIcon } from '@heroicons/react/24/outline';
import { Product } from '../services/product.service';

const FavouritesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [favourites, setFavourites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavourites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadFavourites = async () => {
    try {
      setLoading(true);
      // Load favourites from localStorage for demo
      const savedFavourites = localStorage.getItem('favourites');
      if (savedFavourites) {
        const favouriteIds = JSON.parse(savedFavourites);
        
        // Load product details for favourites
        // In a real app, this would be an API call
        const { mockProducts } = await import('../data/mockData');
        const favouriteProducts = mockProducts.filter(product => 
          favouriteIds.includes(product.id)
        );
        
        setFavourites(favouriteProducts);
      }
    } catch (err) {
      console.error('Failed to load favourites:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = (productId: string) => {
    const savedFavourites = localStorage.getItem('favourites');
    if (savedFavourites) {
      const favouriteIds = JSON.parse(savedFavourites);
      const updatedIds = favouriteIds.filter((id: string) => id !== productId);
      localStorage.setItem('favourites', JSON.stringify(updatedIds));
      
      // Update state
      setFavourites(prev => prev.filter(product => product.id !== productId));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Please Log In</h1>
          <p className="text-text-secondary mb-6">You need to be logged in to view your favourites.</p>
          <Link to="/login">
            <Button variant="primary" className="btn-hover-lift">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">My Favourites</h1>
          <p className="text-text-secondary mt-2">Your saved products for easy access</p>
        </div>

        {favourites.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="h-16 w-16 text-border-color mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">No Favourites Yet</h2>
            <p className="text-text-secondary mb-6">
              Start adding products to your favourites by clicking the heart icon on any product.
            </p>
            <Link to="/store">
              <Button variant="primary" className="btn-hover-lift">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-text-secondary">
                {favourites.length} {favourites.length === 1 ? 'product' : 'products'} in your favourites
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favourites.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  
                  {/* Remove from favourites button */}
                  <button
                    onClick={() => removeFavourite(product.id)}
                    className="absolute top-2 right-2 p-2 bg-[#1a1a1a] rounded-full shadow-md hover:bg-red-500/10 transition-colors border border-[#2d2d2d]"
                    title="Remove from favourites"
                  >
                    <HeartIcon className="h-5 w-5 text-red-400 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;