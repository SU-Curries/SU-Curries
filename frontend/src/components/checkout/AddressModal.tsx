import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Input from '../common/Input';
import Button from '../common/Button';
import { userService } from '../../services/user.service';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressAdded: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onAddressAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Germany',
    phone: '',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For demo purposes, simulate address creation
      const newAddress = {
        id: `addr-${Date.now()}`,
        ...formData,
      };
      
      // In a real app, this would call the API
      // await userService.createAddress(formData);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Germany',
        phone: '',
        isDefault: false,
      });
      
      onAddressAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-primary-bg rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add New Address</h3>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              name="addressLine1"
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
            />

            <Input
              name="addressLine2"
              label="Address Line 2 (Optional)"
              value={formData.addressLine2}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <Input
                name="state"
                label="State/Province"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="postalCode"
                label="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-secondary-bg text-text-primary border border-border-color focus:outline-none focus:ring-2 focus:ring-accent-color"
                  required
                >
                  <option value="Germany">Germany</option>
                  <option value="Austria">Austria</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Belgium">Belgium</option>
                </select>
              </div>
            </div>

            <Input
              name="phone"
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 text-accent-color focus:ring-accent-color"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-text-primary">
                Set as default address
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Adding...' : 'Add Address'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;