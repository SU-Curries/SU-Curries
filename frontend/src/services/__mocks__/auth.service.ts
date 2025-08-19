/**
 * Mock Auth Service for Testing
 */

export const authService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  requestPasswordReset: jest.fn(),
  changePassword: jest.fn(),
  refreshToken: jest.fn(),
  getCurrentUser: jest.fn(),
  updateProfile: jest.fn(),
  isAuthenticated: jest.fn(),
  getToken: jest.fn(),
  setToken: jest.fn(),
  removeToken: jest.fn(),
};

export default authService;