import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (type !== 'error') {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white animate-pulse';
      case 'warning':
        return 'bg-yellow-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80 animate-in slide-in-from-top-2 ${getToastStyles()}`}>
      {getIcon()}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70">
        <XCircleIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;