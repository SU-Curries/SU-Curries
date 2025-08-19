import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { ShoppingBagIcon, ClipboardDocumentListIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const services = [
  {
    title: 'Online Store',
    subtitle: 'Premium Products',
    description: 'Discover our authentic curry bases, gravies, and spice mixes. Bring restaurant-quality flavors to your home kitchen.',
    cta: 'Shop Now',
    link: '/store',
    icon: <ShoppingBagIcon className="h-16 w-16" />,
    gradient: 'from-accent-color to-accent-hover',
    bgImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Fine Dining',
    subtitle: 'Restaurant Experience',
    description: 'Book a table at our restaurant and savor expertly crafted dishes in an authentic Indian dining atmosphere.',
    cta: 'Book Table',
    link: '/book-table',
    icon: <BookOpenIcon className="h-16 w-16" />,
    gradient: 'from-warm-orange to-warm-yellow',
    bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Event Catering',
    subtitle: 'Special Occasions',
    description: 'From intimate gatherings to grand celebrations, we provide exceptional catering services tailored to your event.',
    cta: 'Get Quote',
    link: '/catering',
    icon: <ClipboardDocumentListIcon className="h-16 w-16" />,
    gradient: 'from-accent-hover to-accent-color',
    bgImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

const ServicesOverview = () => {
  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <p className="text-accent-color font-semibold text-lg uppercase tracking-wide mb-4">What We Offer</p>
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Our Services</h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          From premium products to exceptional dining experiences, we bring authentic Indian flavors to every aspect of your culinary journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={service.bgImage} 
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
            </div>
            
            {/* Content */}
            <div className="relative p-8 h-96 flex flex-col justify-end text-white">
              <div className={`bg-gradient-to-r ${service.gradient} p-4 rounded-2xl mb-6 w-fit group-hover:scale-110 transition-transform duration-300`}>
                {React.cloneElement(service.icon, { className: "h-12 w-12 text-white" })}
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-accent-color font-semibold text-sm uppercase tracking-wide mb-2">
                    {service.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-accent-color transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-gray-200 leading-relaxed mb-6">
                  {service.description}
                </p>
                
                <Link to={service.link}>
                  <Button 
                    variant="primary" 
                    className="group-hover:scale-105 transition-transform duration-300 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white hover:text-black"
                  >
                    {service.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesOverview; 