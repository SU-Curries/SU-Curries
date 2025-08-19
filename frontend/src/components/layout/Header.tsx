import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ShoppingCartIcon, UserCircleIcon, GlobeAltIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import CartSidebar from '../store/CartSidebar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// In @headlessui/react v1.x, Menu.Button and Menu.Items are used instead of MenuButton and MenuItems
const MenuButton = Menu.Button;
const MenuItems = Menu.Items;
const MenuItem: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { itemCount } = useCart();
  const showCart = location.pathname === '/' || location.pathname === '/store';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLanguageMenu(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Menu Button and Company Name */}
            <div className="flex items-center">
              {/* Menu Button */}
              <div className="relative mr-3">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-[#ff6b35] hover:bg-gray-100 transition-colors focus:outline-none active:outline-none"
                  aria-label="Open menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/about"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#ff6b35] transition-colors"
                    >
                      {t('header.about_us')}
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#ff6b35] transition-colors"
                    >
                      {t('header.contact_us')}
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Company Name */}
              <Link
                to="/"
                className="text-2xl font-bold text-[#ff6b35] hover:text-[#e55a2b] transition-colors"
              >
                SU Curries
              </Link>
            </div>

            {/* Center: Main Navigation */}
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/" 
                      ? "text-[#ff6b35] border-b-2 border-[#ff6b35] pb-1" 
                      : "text-gray-600 hover:text-[#ff6b35]"
                  }`}
                >
                  {t('header.home')}
                </Link>
                <Link
                  to="/store"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/store" 
                      ? "text-[#ff6b35] border-b-2 border-[#ff6b35] pb-1" 
                      : "text-gray-600 hover:text-[#ff6b35]"
                  }`}
                >
                  {t('header.store')}
                </Link>
                <Link
                  to="/book-table"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/book-table" 
                      ? "text-[#ff6b35] border-b-2 border-[#ff6b35] pb-1" 
                      : "text-gray-600 hover:text-[#ff6b35]"
                  }`}
                >
                  {t('header.book_table')}
                </Link>
                <Link
                  to="/catering"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/catering" 
                      ? "text-[#ff6b35] border-b-2 border-[#ff6b35] pb-1" 
                      : "text-gray-600 hover:text-[#ff6b35]"
                  }`}
                >
                  {t('header.catering')}
                </Link>
              </div>
            </div>

            {/* Right: Search, Language, Cart, Profile */}
            <div className="flex items-center space-x-1">
              {/* Search */}
              <div className="relative">
                {isSearchExpanded ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 px-3 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                      autoFocus
                      onBlur={() => setIsSearchExpanded(false)}
                    />
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#ff6b35] hover:bg-gray-100 rounded-full transition-colors focus:outline-none active:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Language Toggle with Globe Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#ff6b35] hover:bg-gray-100 rounded-full transition-colors focus:outline-none active:outline-none"
                  aria-label="Change language"
                  title="Change language"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c2.5 0 4.5 4 4.5 9s-2 9-4.5 9-4.5-4-4.5-9 2-9 4.5-9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18" />
                  </svg>
                </button>

                {showLanguageMenu && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          i18n.language === lang.code ? "bg-[#ff6b35] text-white" : "text-gray-700"
                        }`}
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              {showCart && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#ff6b35] hover:bg-gray-100 rounded-full transition-colors focus:outline-none active:outline-none"
                  aria-label="Shopping cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="20" cy="20" r="1" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ff6b35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              )}

              {isAuthenticated && (
                <Menu as="div" className="relative z-50">
                    <MenuButton className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#ff6b35] hover:bg-gray-100 rounded-full transition-colors focus:outline-none active:outline-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </MenuButton>
                    <MenuItems className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                      <MenuItem>
                        <Link to="/profile" className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#ff6b35] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{t('header.profile')}</span>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/orders" className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#ff6b35] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>{t('header.orders')}</span>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/bookings" className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#ff6b35] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v1a1 1 0 01-1 1h-1v9a2 2 0 01-2 2H7a2 2 0 01-2-2v-9H4a1 1 0 01-1-1V9a2 2 0 012-2h3z" />
                          </svg>
                          <span>{t('header.bookings')}</span>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/favourites" className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#ff6b35] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>Favourites</span>
                        </Link>
                      </MenuItem>
                      <div className="border-t border-gray-200 my-2"></div>
                      <MenuItem>
                        <button onClick={logout} className="flex items-center space-x-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>{t('header.logout')}</span>
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
              )}

              {!isAuthenticated && (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#ff6b35] hover:bg-[#e55a2b] rounded-md transition-colors"
                  aria-label="Sign in"
                >
                  {t('header.login')}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="flex justify-around">
              <Link
                to="/"
                className={`px-3 py-2 text-xs font-medium ${
                  location.pathname === "/" ? "text-[#ff6b35]" : "text-gray-600"
                }`}
              >
                {t('header.home')}
              </Link>
              <Link
                to="/store"
                className={`px-3 py-2 text-xs font-medium ${
                  location.pathname === "/store" ? "text-[#ff6b35]" : "text-gray-600"
                }`}
              >
                {t('header.store')}
              </Link>
              <Link
                to="/book-table"
                className={`px-3 py-2 text-xs font-medium ${
                  location.pathname === "/book-table" ? "text-[#ff6b35]" : "text-gray-600"
                }`}
              >
                Book Table
              </Link>
              <Link
                to="/catering"
                className={`px-3 py-2 text-xs font-medium ${
                  location.pathname === "/catering" ? "text-[#ff6b35]" : "text-gray-600"
                }`}
              >
                {t('header.catering')}
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;