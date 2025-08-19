import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

const Footer = () => {
  return (
    <footer className="bg-primary-bg text-text-secondary pt-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Information */}
          <div>
            <Link to="/" className="flex items-center mb-4 hover:opacity-80 transition-opacity">
              <img
                src="/Assets/su_curries_logo.png"
                alt="SU Foods"
                className="h-8 w-auto border border-gray-200 rounded-md p-1"
              />
            </Link>
            <p>Your one-stop shop for delicious premixes, restaurant dining, and catering services.</p>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Us</h3>
            <p>Phone: +1 234 567 890</p>
            <p>Email: info@sufoods.com</p>
            <p>Address: 123 Food Street, Flavor Town</p>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Business Hours</h3>
            <p>Mon - Fri: 9:00 AM - 10:00 PM</p>
            <p>Sat - Sun: 11:00 AM - 11:00 PM</p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Subscribe to our Newsletter</h3>
            <form className="flex">
              <Input type="email" placeholder="Your email" className="rounded-r-none" />
              <Button variant="primary" className="rounded-l-none">Subscribe</Button>
            </form>
          </div>
        </div>

        {/* Social Media & Legal Links */}
        <div className="mt-8 py-6 border-t border-border-color flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6">
            {/* Facebook */}
            <a href="https://facebook.com/sucurries" target="_blank" rel="noopener noreferrer" className="hover:text-accent-color transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            {/* Instagram */}
            <a href="https://instagram.com/sucurries" target="_blank" rel="noopener noreferrer" className="hover:text-accent-color transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
              </svg>
            </a>
            
            {/* Twitter/X */}
            <a href="https://twitter.com/sucurries" target="_blank" rel="noopener noreferrer" className="hover:text-accent-color transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            {/* YouTube */}
            <a href="https://youtube.com/@sucurries" target="_blank" rel="noopener noreferrer" className="hover:text-accent-color transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a href="https://linkedin.com/company/sucurries" target="_blank" rel="noopener noreferrer" className="hover:text-accent-color transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm hover:text-accent-color">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link to="/terms-of-service" className="text-sm hover:text-accent-color">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 