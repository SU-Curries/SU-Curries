import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#ff6b35] focus:text-white focus:rounded-md focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#ff6b35]"
      onFocus={(e) => {
        // Ensure the target element exists and is focusable
        const target = document.querySelector(href);
        if (target) {
          target.setAttribute('tabindex', '-1');
        }
      }}
    >
      {children}
    </a>
  );
};

export default SkipLink;