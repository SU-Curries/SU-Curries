import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

const SlidePanel: React.FC<SlidePanelProps> = ({ isOpen, onClose, title, children, width = 'md' }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const widthClasses = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[480px]'
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-[#1a1a1a] bg-opacity-50"
            onClick={onClose}
          />
          <div className={`absolute right-0 top-0 h-full ${widthClasses[width]} bg-[#2d2d2d] border-l border-[#404040] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#404040] p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#404040] rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-[#cccccc]" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SlidePanel;