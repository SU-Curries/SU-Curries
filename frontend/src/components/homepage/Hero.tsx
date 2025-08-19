import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const slides = [
  {
    title: 'Authentic Indian Flavors',
    subtitle: 'Made Simple',
    description: 'Transform your kitchen into an Indian restaurant with our premium curry bases, gravies, and spice mixes.',
    cta: 'Shop Now',
    link: '/store',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Dine With Us',
    subtitle: 'Experience Excellence',
    description: 'Book a table at our restaurant and savor the rich, authentic flavors crafted by our expert chefs.',
    cta: 'Book a Table',
    link: '/book-table',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Catering Services',
    subtitle: 'For Every Occasion',
    description: 'From intimate gatherings to grand celebrations, we bring authentic Indian cuisine to your special events.',
    cta: 'Get a Quote',
    link: '/catering',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-2xl shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-start text-left text-white p-8 md:p-16">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-2xl"
            >
              <p className="text-accent-color font-semibold text-lg md:text-xl mb-2 uppercase tracking-wide">
                {slides[currentSlide].subtitle}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
                {slides[currentSlide].description}
              </p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link to={slides[currentSlide].link}>
                  <Button variant="primary" className="text-lg px-8 py-4">
                    {slides[currentSlide].cta}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Dots - Matching Example Style */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-accent-color' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          ></button>
        ))}
      </div>
      
      {/* Circular Navigation Arrows - Matching Example Style */}
      <button
        onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-accent-color hover:bg-accent-color/90 text-white p-3 transition-all duration-200 shadow-lg focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-accent-color hover:bg-accent-color/90 text-white p-3 transition-all duration-200 shadow-lg focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Hero;