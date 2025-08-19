/**
 * LoginPage Component Tests
 * Comprehensive test suite for login functionality
 */

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils/testUtils';
import LoginPage from '../../pages/LoginPage';
import { useAuth } from '../../context/AuthContext';

// Mock the auth context
jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('renders login form correctly', () => {
      render(<LoginPage />);
      
      expect(screen.getByText('auth.login_title')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /auth\.email/i })).toBeInTheDocument();
      expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /auth.sign_in|common.loading/i })).toBeInTheDocument();
      expect(screen.getByText('auth.no_account')).toBeInTheDocument();
    });

    it('renders forgot password link', () => {
      render(<LoginPage />);
      
      expect(screen.getByText('auth.forgot_password')).toBeInTheDocument();
    });

    it('renders remember me checkbox', () => {
      render(<LoginPage />);
      
      expect(screen.getByLabelText('auth.remember_me')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid credentials', async () => {
      const mockLogin = jest.fn();
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        loading: false,
        login: mockLogin,
        register: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
      });
      
      render(<LoginPage />);
      
      const emailInput = screen.getByRole('textbox', { name: /auth\.email/i });
      const passwordInput = screen.getByLabelText('auth.password');
      const submitButton = screen.getByRole('button', { name: /auth.sign_in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('shows loading state during submission', async () => {
      const mockLogin = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        loading: false,
        login: mockLogin,
        register: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
      });
      
      render(<LoginPage />);
      
      const emailInput = screen.getByRole('textbox', { name: /auth\.email/i });
      const passwordInput = screen.getByLabelText('auth.password');
      const submitButton = screen.getByRole('button', { name: /auth.sign_in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      // Check that the button shows loading state
      expect(screen.getByRole('button', { name: /common.loading/i })).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('redirects authenticated users', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'customer' },
        loading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
      });
      
      render(<LoginPage />);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('redirects admin users to admin panel', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: '1', email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'admin' },
        loading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
      });
      
      render(<LoginPage />);
      
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  describe('Form Interaction', () => {
    it('updates form data when user types', () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByRole('textbox', { name: /auth\.email/i }) as HTMLInputElement;
      const passwordInput = screen.getByLabelText('auth.password') as HTMLInputElement;
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });

    it('toggles remember me checkbox', () => {
      render(<LoginPage />);
      
      const rememberMeCheckbox = screen.getByLabelText('auth.remember_me') as HTMLInputElement;
      
      expect(rememberMeCheckbox.checked).toBe(false);
      
      fireEvent.click(rememberMeCheckbox);
      
      expect(rememberMeCheckbox.checked).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<LoginPage />);
      
      expect(screen.getByRole('textbox', { name: /auth\.email/i })).toBeInTheDocument();
      expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
      expect(screen.getByLabelText('auth.remember_me')).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<LoginPage />);
      
      expect(screen.getByRole('button', { name: /auth.sign_in/i })).toBeInTheDocument();
    });

    it('has proper link roles', () => {
      render(<LoginPage />);
      
      expect(screen.getByRole('link', { name: /auth.register_here/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /auth.forgot_password/i })).toBeInTheDocument();
    });
  });
});