import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-[#ff6b35] mb-4">404</div>
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] rounded-full flex items-center justify-center opacity-20">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.935-6.072-2.456M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-[#cccccc] mb-6 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off like a lost curry recipe. 
            Don't worry, we'll help you find your way back to delicious content.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full bg-[#ff6b35] text-white py-3 px-6 rounded-md font-medium hover:bg-[#e55a2b] transition-colors btn-hover-lift"
          >
            Back to Home
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/store"
              className="flex-1 bg-[#2d2d2d] text-white py-3 px-6 rounded-md font-medium hover:bg-[#3d3d3d] transition-colors border border-[#404040]"
            >
              Browse Store
            </Link>
            
            <Link
              to="/book-table"
              className="flex-1 bg-[#2d2d2d] text-white py-3 px-6 rounded-md font-medium hover:bg-[#3d3d3d] transition-colors border border-[#404040]"
            >
              Book Table
            </Link>
          </div>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-[#2d2d2d]">
          <h3 className="text-lg font-semibold text-white mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link to="/menu" className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors">
              Our Menu
            </Link>
            <Link to="/catering" className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors">
              Catering Services
            </Link>
            <Link to="/about" className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;