import React from 'react';

const TrustBanner = () => {
  return (
    <div className="bg-green-600 text-white py-3 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="flex items-center gap-6 mb-2 md:mb-0">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">🚚</span>
              <span className="font-medium">Free EU delivery over €50</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">⭐</span>
              <span className="font-medium">50,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">🔒</span>
              <span className="font-medium">SSL Secured</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-300">📞</span>
            <span className="font-medium">+31-20-123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBanner;