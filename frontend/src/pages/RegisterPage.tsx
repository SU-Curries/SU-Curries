import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SuccessModal from '../components/common/SuccessModal';
import { isValidEmail, isValidPassword } from '../utils/security';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email address';
    if (!isValidPassword(formData.password)) newErrors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setSubmitting(true);
        
        // Import dataStore dynamically to avoid circular dependencies
        const { dataStore } = await import('../store/dataStore');
        
        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          email: formData.email,
          password: formData.password,
          firstName: formData.fullName.split(' ')[0],
          lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
          phone: formData.phone,
          role: 'customer',
          isActive: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add user to mock data (in real app, this would be an API call)
        const users = dataStore.getUsers();
        
        // Check if user already exists
        if (users.find(u => u.email === formData.email)) {
          setErrors({ email: 'An account with this email already exists' });
          return;
        }
        
        // Add new user (this is a mock implementation)
        users.push(newUser);
        
        console.log('Registration successful:', newUser);
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Registration failed:', error);
        setErrors({ general: 'Registration failed. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSuccessModalAction = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Create an Account</h1>
        <Card className="p-8 bg-[#1a1a1a] border-[#2d2d2d]">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 rounded-md">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <PasswordInput
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <Input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <div className="flex items-center">
            <input type="checkbox" id="terms" name="terms" required className="mr-2 bg-[#2d2d2d] border-[#404040] text-[#ff6b35] focus:ring-[#ff6b35]" />
            <label htmlFor="terms" className="text-sm text-[#cccccc]">
              I agree to the <Link to="/terms-of-service" className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors">Terms and Conditions</Link>
            </label>
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full btn-hover-lift"
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Register'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[#cccccc]">
          Already have an account? <Link to="/login" className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors">Login here</Link>
        </p>
        </Card>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          onAction={handleSuccessModalAction}
          title="Account Created Successfully!"
          message="Welcome to SU Curries! Your account has been created and you can now log in to start ordering delicious food and booking tables."
          actionText="Go to Login"
        />
      </div>
    </div>
  );
};

export default RegisterPage; 