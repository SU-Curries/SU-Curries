import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <ExclamationTriangleIcon className="w-12 h-12 text-red-400" />;
      case 'success':
        return <CheckCircleIcon className="w-12 h-12 text-green-400" />;
      case 'info':
        return <InformationCircleIcon className="w-12 h-12 text-blue-400" />;
      default:
        return <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400" />;
    }
  };

  const getButtonVariant = (): 'primary' | 'secondary' | 'ghost' => {
    switch (type) {
      case 'danger':
        return 'primary';
      case 'success':
        return 'primary';
      default:
        return 'primary';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg shadow-xl max-w-md w-full animate-slide-up">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#888888] hover:text-white transition-colors focus:outline-none active:outline-none"
            disabled={loading}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              {getIcon()}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white text-center mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-[#cccccc] text-center mb-6">
              {message}
            </p>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                {cancelText}
              </Button>
              <Button
                variant={getButtonVariant()}
                onClick={onConfirm}
                className="flex-1 btn-hover-lift"
                disabled={loading}
                destructive={type === 'danger'}
              >
                {loading ? 'Processing...' : confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;