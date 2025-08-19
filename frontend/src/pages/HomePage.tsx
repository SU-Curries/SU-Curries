import React from 'react';
import Hero from '../components/homepage/Hero';
import ServicesOverview from '../components/homepage/ServicesOverview';
import FeaturedProducts from '../components/homepage/FeaturedProducts';
import AboutUsPreview from '../components/homepage/AboutUsPreview';
import CustomerTestimonials from '../components/homepage/CustomerTestimonials';
import NewsletterSignup from '../components/homepage/NewsletterSignup';

const HomePage = () => {
  return (
    <div>
      <Hero />
      {/* Optimized Flow Based on User Psychology */}
      <FeaturedProducts />
      <ServicesOverview />
      {/* Combined Credibility Section */}
      <AboutUsPreview />
      <CustomerTestimonials />
      <NewsletterSignup />
    </div>
  );
};

export default HomePage; 