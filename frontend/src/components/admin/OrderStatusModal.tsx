import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { OrderStatus } from '../../services/order.service';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  orderId: string;
  currentStatus: OrderStatus;
  orderNumber: string;
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdateStatus,
  orderId,
  currentStatus,
  orderNumber
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-400' },
    { value: 'processing', label: 'Processing', color: 'text-blue-400' },
    { value: 'shipped', label: 'Shipped', color: 'text-purple-400' },
    { value: 'delivered', label: 'Delivered', color: 'text-green-400' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-400' }
  ];

  const handleSubmit = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onUpdateStatus(orderId, selectedStatus);
      onClose();
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus(currentStatus);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Update Order Status - ${orderNumber}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Current Status: <span className={statusOptions.find(s => s.value === currentStatus)?.color}>
              {statusOptions.find(s => s.value === currentStatus)?.label}
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            New Status
          </label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={selectedStatus === option.value}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="mr-3 text-accent-color focus:ring-accent-color"
                />
                <span className={`${option.color} font-medium`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {selectedStatus !== currentStatus && (
          <div className="bg-secondary-bg p-3 rounded-md">
            <p className="text-sm text-text-secondary">
              Order status will be updated from{' '}
              <span className={statusOptions.find(s => s.value === currentStatus)?.color}>
                {statusOptions.find(s => s.value === currentStatus)?.label}
              </span>
              {' '}to{' '}
              <span className={statusOptions.find(s => s.value === selectedStatus)?.color}>
                {statusOptions.find(s => s.value === selectedStatus)?.label}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || selectedStatus === currentStatus}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </div>
    </Modal>
  );
};

export default OrderStatusModal;