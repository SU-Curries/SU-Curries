import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ShoppingBagIcon, UserCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { itemCount } = useCart();

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: '/' },
    { icon: ShoppingBagIcon, label: 'Store', path: '/store', badge: itemCount > 0 ? itemCount : null },
    { icon: PhoneIcon, label: 'Book', path: '/book-table' },
    { icon: UserCircleIcon, label: 'Account', path: '/profile' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#404040] z-50">
      <div className="grid grid-cols-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-1 relative ${
                isActive ? 'text-accent-color' : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-accent-color text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;