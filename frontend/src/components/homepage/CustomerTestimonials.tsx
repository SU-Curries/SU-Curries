import React from 'react';
import Card from '../common/Card';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Home Chef',
    testimonial: 'SU Curries has transformed my cooking! The curry bases are so authentic, my family thinks I spent hours in the kitchen. The butter chicken gravy is absolutely divine.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Food Enthusiast',
    testimonial: 'The restaurant experience was phenomenal! Every dish was bursting with flavor and authenticity. The ambiance and service made our anniversary dinner truly special.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Event Organizer',
    testimonial: 'Their catering service exceeded all expectations! The team handled our 200-guest wedding flawlessly. Every guest complimented the authentic flavors and presentation.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
];

const CustomerTestimonials = () => {
  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <p className="text-accent-color font-semibold text-lg uppercase tracking-wide mb-4">Testimonials</p>
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">What Our Customers Say</h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Don't just take our word for it - hear from the people who love our authentic flavors and exceptional service.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-8 text-center relative overflow-hidden group">
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 text-accent-color/20 group-hover:text-accent-color/40 transition-colors duration-300">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>
            
            {/* Profile Image with Border */}
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-r from-accent-color to-accent-hover">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            
            {/* Star Rating */}
            <div className="flex justify-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-warm-yellow fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            {/* Testimonial Text */}
            <p className="text-text-secondary mb-6 leading-relaxed italic text-lg group-hover:text-text-primary transition-colors duration-300">
              "{testimonial.testimonial}"
            </p>
            
            {/* Customer Info */}
            <div className="border-t border-accent-color/20 pt-4">
              <h4 className="text-lg font-bold text-text-primary group-hover:text-accent-color transition-colors duration-300">
                {testimonial.name}
              </h4>
              <p className="text-accent-color text-sm font-medium">
                {testimonial.role}
              </p>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Call to Action */}
      <div className="text-center mt-16">
        <p className="text-text-secondary mb-4">Join thousands of satisfied customers</p>
        <div className="flex justify-center items-center space-x-8 text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <div className="flex text-warm-yellow">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span>4.9/5 Average Rating</span>
          </div>
          <div>•</div>
          <div>2,500+ Happy Customers</div>
          <div>•</div>
          <div>99% Satisfaction Rate</div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials; 