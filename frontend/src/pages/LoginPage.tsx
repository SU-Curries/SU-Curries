import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';

import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from);
      }
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      // Navigation is handled by the useEffect above
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.login_failed'));
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">{t('auth.login_title')}</h1>

        {/* Demo Account Instructions - Development Only */}
        <div className="mb-6 p-4 bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg">
          <h3 className="font-semibold text-[#ff6b35] mb-2">Demo Accounts</h3>
          <div className="space-y-2 text-sm text-[#cccccc]">
            <div>
              <strong className="text-white">Admin:</strong> admin@sucurries.com / admin123<br />
              <button
                type="button"
                onClick={() => setFormData({
                  email: 'admin@sucurries.com',
                  password: 'admin123',
                  rememberMe: false
                })}
                className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors"
              >
                Click to auto-fill
              </button>
            </div>
            <div>
              <strong className="text-white">Customer 1:</strong> john.doe@example.com / password123<br />
              <button
                type="button"
                onClick={() => setFormData({
                  email: 'john.doe@example.com',
                  password: 'password123',
                  rememberMe: false
                })}
                className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors"
              >
                Click to auto-fill
              </button>
            </div>
            <div>
              <strong className="text-white">Customer 2:</strong> jane.smith@example.com / password123<br />
              <button
                type="button"
                onClick={() => setFormData({
                  email: 'jane.smith@example.com',
                  password: 'password123',
                  rememberMe: false
                })}
                className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors"
              >
                Click to auto-fill
              </button>
            </div>
            <div>
              <strong className="text-white">Driver:</strong> driver@sucurries.com / driver123<br />
              <button
                type="button"
                onClick={() => setFormData({
                  email: 'driver@sucurries.com',
                  password: 'driver123',
                  rememberMe: false
                })}
                className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors"
              >
                Click to auto-fill
              </button>
            </div>
          </div>
        </div>

        <Card className="p-8 bg-[#1a1a1a] border-[#2d2d2d]">
          {error && <Alert type="error" message={error} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              name="email"
              label={t('auth.email')}
              placeholder={t('auth.email_placeholder')}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <PasswordInput
              name="password"
              label={t('auth.password')}
              placeholder={t('auth.password_placeholder')}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2 bg-[#2d2d2d] border-[#404040] text-[#ff6b35] focus:ring-[#ff6b35]"
                  disabled={loading}
                />
                <label htmlFor="rememberMe" className="text-sm text-[#cccccc]">
                  {t('auth.remember_me')}
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-[#ff6b35] hover:text-[#e55a2b] transition-colors">
                {t('auth.forgot_password')}
              </Link>
            </div>
            <Button type="submit" variant="primary" className="w-full btn-hover-lift" disabled={loading}>
              {loading ? t('common.loading') : t('auth.sign_in')}
            </Button>
          </form>
          

          <p className="mt-4 text-center text-sm text-[#cccccc]">
            {t('auth.no_account')} <Link to="/register" className="text-[#ff6b35] hover:text-[#e55a2b] transition-colors">{t('auth.register_here')}</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage; 