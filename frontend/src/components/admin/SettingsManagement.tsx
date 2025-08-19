import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { CogIcon, KeyIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface PaymentSettings {
  stripePublishableKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  paypalClientSecret: string;
  enableStripe: boolean;
  enablePaypal: boolean;
  enableSimulation: boolean;
}

const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<PaymentSettings>({
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalClientSecret: '',
    enableStripe: false,
    enablePaypal: false,
    enableSimulation: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load settings from localStorage for demo
      const savedSettings = localStorage.getItem('paymentSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Save to localStorage for demo (in real app, this would be an API call)
      localStorage.setItem('paymentSettings', JSON.stringify(settings));
      
      setSuccess('Payment settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (provider: 'stripe' | 'paypal') => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`${provider.charAt(0).toUpperCase() + provider.slice(1)} connection test successful!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(`Failed to test ${provider} connection`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <CogIcon className="h-6 w-6 mr-2" />
          Payment Settings
        </h2>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center"
        >
          <KeyIcon className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Payment Mode Selection */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCardIcon className="h-5 w-5 mr-2" />
          Payment Mode
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="enableSimulation"
              checked={settings.enableSimulation}
              onChange={handleInputChange}
              className="mr-3 h-4 w-4 text-accent-color focus:ring-accent-color border-gray-300 rounded"
            />
            <div>
              <span className="font-medium">Simulation Mode (Recommended for Testing)</span>
              <p className="text-sm text-gray-600">
                Use simulated payments for testing. No real transactions will be processed.
              </p>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="enableStripe"
              checked={settings.enableStripe}
              onChange={handleInputChange}
              className="mr-3 h-4 w-4 text-accent-color focus:ring-accent-color border-gray-300 rounded"
            />
            <div>
              <span className="font-medium">Enable Stripe Payments</span>
              <p className="text-sm text-gray-600">
                Accept credit card payments through Stripe
              </p>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="enablePaypal"
              checked={settings.enablePaypal}
              onChange={handleInputChange}
              className="mr-3 h-4 w-4 text-accent-color focus:ring-accent-color border-gray-300 rounded"
            />
            <div>
              <span className="font-medium">Enable PayPal Payments</span>
              <p className="text-sm text-gray-600">
                Accept payments through PayPal
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Stripe Settings */}
      {settings.enableStripe && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Stripe Configuration</h3>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowKeys(!showKeys)}
              >
                {showKeys ? 'Hide Keys' : 'Show Keys'}
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleTestConnection('stripe')}
                disabled={loading}
              >
                Test Connection
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Stripe Publishable Key"
              name="stripePublishableKey"
              type={showKeys ? 'text' : 'password'}
              value={settings.stripePublishableKey}
              onChange={handleInputChange}
              placeholder="pk_test_..."
              className="font-mono text-sm"
            />
            <Input
              label="Stripe Secret Key"
              name="stripeSecretKey"
              type={showKeys ? 'text' : 'password'}
              value={settings.stripeSecretKey}
              onChange={handleInputChange}
              placeholder="sk_test_..."
              className="font-mono text-sm"
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to get Stripe Keys:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Go to <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard</a></li>
              <li>2. Navigate to Developers → API keys</li>
              <li>3. Copy your Publishable key and Secret key</li>
              <li>4. For testing, use test keys (they start with pk_test_ and sk_test_)</li>
            </ol>
          </div>
        </div>
      )}

      {/* PayPal Settings */}
      {settings.enablePaypal && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">PayPal Configuration</h3>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleTestConnection('paypal')}
                disabled={loading}
              >
                Test Connection
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="PayPal Client ID"
              name="paypalClientId"
              type={showKeys ? 'text' : 'password'}
              value={settings.paypalClientId}
              onChange={handleInputChange}
              placeholder="Your PayPal Client ID"
              className="font-mono text-sm"
            />
            <Input
              label="PayPal Client Secret"
              name="paypalClientSecret"
              type={showKeys ? 'text' : 'password'}
              value={settings.paypalClientSecret}
              onChange={handleInputChange}
              placeholder="Your PayPal Client Secret"
              className="font-mono text-sm"
            />
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">How to get PayPal Keys:</h4>
            <ol className="text-sm text-yellow-800 space-y-1">
              <li>1. Go to <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="underline">PayPal Developer</a></li>
              <li>2. Create or log into your developer account</li>
              <li>3. Create a new app in the sandbox or live environment</li>
              <li>4. Copy your Client ID and Client Secret</li>
            </ol>
          </div>
        </div>
      )}

      {/* Current Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Current Payment Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              settings.enableSimulation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {settings.enableSimulation ? 'Active' : 'Inactive'}
            </div>
            <p className="mt-2 font-medium">Simulation Mode</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              settings.enableStripe && settings.stripePublishableKey && settings.stripeSecretKey 
                ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {settings.enableStripe && settings.stripePublishableKey && settings.stripeSecretKey ? 'Configured' : 'Not Configured'}
            </div>
            <p className="mt-2 font-medium">Stripe</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              settings.enablePaypal && settings.paypalClientId && settings.paypalClientSecret 
                ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {settings.enablePaypal && settings.paypalClientId && settings.paypalClientSecret ? 'Configured' : 'Not Configured'}
            </div>
            <p className="mt-2 font-medium">PayPal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;