/**
 * Mock AuthContext for Testing
 */

import React from 'react';

export const useAuth = jest.fn(() => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  updateUser: jest.fn(),
}));

export const AuthContext = React.createContext({
  isAuthenticated: false,
  user: null,
  loading: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  updateUser: jest.fn(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div data-testid="mock-auth-provider">{children}</div>;
};