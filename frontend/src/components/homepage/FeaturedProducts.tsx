import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import ProductCard, { Product } from '../store/ProductCard';

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Curry Base',
    description: 'Rich, aromatic base with authentic spices. Perfect for chicken, lamb, or vegetable curries.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    category: 'Curry Bases',
    sku: 'PCB-001',
    stockQuantity: 50,
    status: 'active' as const,
    isFeatured: true,
    slug: 'premium-curry-base',
    categoryId: 'cat-1',
  },
  {
    id: '2',
    name: 'Butter Chicken Gravy',
    description: 'Creamy tomato-based gravy with the perfect blend of spices for authentic butter chicken.',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    category: 'Gravies',
    sku: 'BCG-001',
    stockQuantity: 30,
    status: 'active' as const,
    isFeatured: true,
    slug: 'butter-chicken-gravy',
    categoryId: 'cat-2',
  },
  {
    id: '3',
    name: 'Biryani Masala',
    description: 'Authentic spice blend for fragrant biryani. Includes saffron and premium whole spices.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    category: 'Spice Mixes',
    sku: 'BM-001',
    stockQuantity: 25,
    status: 'active' as const,
    isFeatured: true,
    slug: 'biryani-masala',
    categoryId: 'cat-3',
  },
  {
    id: '4',
    name: 'Tikka Masala Kit',
    description: 'Complete kit with marinade, curry base, and spices for restaurant-style tikka masala.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 4.6,
    category: 'Special Combos',
    sku: 'TMK-001',
    stockQuantity: 15,
    status: 'active' as const,
    isFeatured: true,
    slug: 'tikka-masala-kit',
    categoryId: 'cat-4',
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-primary-bg to-secondary-bg">
      <div className="text-center mb-16">
        <p className="text-accent-color font-semibold text-lg uppercase tracking-wide mb-4">Best Sellers</p>
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Featured Products</h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Discover our most popular curry bases, gravies, and spice mixes - handpicked by our chefs and loved by customers.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {featuredProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="transform transition-all duration-500"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Link to="/store">
          <Button variant="primary" className="text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
            Explore All Products
            <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </Link>
        <p className="text-text-secondary mt-4 text-sm">
          Free shipping on orders over $50 • 30-day money-back guarantee
        </p>
      </div>
      

    </section>
  );
};

export default FeaturedProducts; 