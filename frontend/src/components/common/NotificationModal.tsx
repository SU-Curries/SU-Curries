import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttonText?: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'OK'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-text-primary">{message}</p>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button
          variant="primary"
          onClick={onClose}
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default NotificationModal;