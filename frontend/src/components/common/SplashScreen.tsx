import React, { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">SU</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SU Curries</h1>
          <p className="text-[#cccccc] text-sm">Authentic Indian Flavors</p>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="w-64 h-1 bg-[#2d2d2d] rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ff6b35] to-[#e55a2b] rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[#888888] text-xs mt-2">{progress}%</p>
        </div>

        {/* Loading Text */}
        <div className="text-[#cccccc] text-sm">
          <div className="flex items-center justify-center space-x-1">
            <span>Loading your culinary experience</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-[#ff6b35] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-[#ff6b35] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-[#ff6b35] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;