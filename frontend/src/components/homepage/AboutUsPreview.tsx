import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const AboutUsPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary-bg to-primary-bg">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-color to-accent-hover rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
            <div className="relative bg-secondary-bg rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Our Kitchen"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Stats Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="grid grid-cols-3 gap-4 text-white text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold">25+</div>
                    <div className="text-xs">Years Experience</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-xs">Authentic Recipes</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-xs">Happy Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="space-y-8">
            <div>
              <p className="text-accent-color font-semibold text-lg uppercase tracking-wide mb-4">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
                Bringing Authentic Indian Flavors to Your Table
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p>
                Founded with a passion for authentic Indian cuisine, SU Curries has been perfecting traditional recipes for over two decades. What started as a small family kitchen has grown into a trusted name for quality spices, curry bases, and exceptional dining experiences.
              </p>
              <p>
                Our master chefs combine time-honored techniques with premium ingredients to create products that bring the true taste of India to your home. Every curry base, gravy, and spice mix is crafted with the same care and attention we put into our restaurant dishes.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-accent-color/10 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">100% Authentic</h4>
                  <p className="text-text-secondary text-sm">Traditional recipes passed down through generations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-accent-color/10 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Made with Love</h4>
                  <p className="text-text-secondary text-sm">Every product crafted with care and passion</p>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about">
                <Button variant="primary" className="text-lg px-8 py-4">
                  Our Full Story
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="ghost" className="text-lg px-8 py-4">
                  View Our Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsPreview; 