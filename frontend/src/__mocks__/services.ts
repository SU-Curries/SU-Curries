/**
 * Comprehensive Service Mocks
 * Centralized service mocking for consistent test behavior
 */

import { 
  mockProducts, 
  mockCategories, 
  mockOrders, 
  mockUser, 
  mockAdminUser, 
  mockCartCalculation,
  generateMockProducts,
  generateMockOrders
} from './data';

// Product Service Mock
export const mockProductService = {
  getProducts: jest.fn(() => Promise.resolve({
    products: mockProducts,
    total: mockProducts.length,
    page: 1,
    limit: 12,
    totalPages: 1
  })),
  
  getCategories: jest.fn(() => Promise.resolve(mockCategories)),
  
  getProduct: jest.fn((id: string) => {
    const product = mockProducts.find(p => p.id === id) || mockProducts[0];
    return Promise.resolve(product);
  }),
  
  getAdminProducts: jest.fn(() => Promise.resolve({
    products: mockProducts,
    total: mockProducts.length
  })),
  
  createProduct: jest.fn((data: any) => Promise.resolve({
    id: 'new-product',
    ...data
  })),
  
  updateProduct: jest.fn((id: string, data: any) => Promise.resolve({
    id,
    ...data
  })),
  
  deleteProduct: jest.fn((id: string) => Promise.resolve({ success: true })),
  
  getFeaturedProducts: jest.fn(() => Promise.resolve(
    mockProducts.filter(p => p.isFeatured)
  ))
};

// Order Service Mock
export const mockOrderService = {
  createOrder: jest.fn((data: any) => Promise.resolve({
    id: 'new-order',
    orderNumber: 'ORD-NEW',
    ...data,
    status: 'pending',
    createdAt: new Date()
  })),
  
  getOrders: jest.fn(() => Promise.resolve({
    orders: mockOrders,
    total: mockOrders.length,
    page: 1,
    limit: 10,
    totalPages: 1
  })),
  
  getOrder: jest.fn((id: string) => {
    const order = mockOrders.find(o => o.id === id) || mockOrders[0];
    return Promise.resolve(order);
  }),
  
  updateOrderStatus: jest.fn((id: string, status: string) => Promise.resolve({
    id,
    status,
    updatedAt: new Date()
  })),
  
  cancelOrder: jest.fn((id: string) => Promise.resolve({
    id,
    status: 'cancelled',
    updatedAt: new Date()
  })),
  
  calculateCart: jest.fn(() => Promise.resolve(mockCartCalculation))
};

// Auth Service Mock
export const mockAuthService = {
  login: jest.fn((credentials: any) => Promise.resolve({
    user: credentials.email === 'admin@example.com' ? mockAdminUser : mockUser,
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token'
  })),
  
  register: jest.fn((data: any) => Promise.resolve({
    user: { id: 'new-user', ...data, role: 'customer' },
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token'
  })),
  
  logout: jest.fn(() => Promise.resolve({ success: true })),
  
  refreshToken: jest.fn(() => Promise.resolve({
    token: 'new-mock-jwt-token',
    refreshToken: 'new-mock-refresh-token'
  })),
  
  getCurrentUser: jest.fn(() => Promise.resolve(mockUser)),
  
  updateProfile: jest.fn((data: any) => Promise.resolve({
    ...mockUser,
    ...data
  })),
  
  changePassword: jest.fn(() => Promise.resolve({ success: true })),
  
  forgotPassword: jest.fn(() => Promise.resolve({ success: true })),
  
  resetPassword: jest.fn(() => Promise.resolve({ success: true }))
};

// User Service Mock
export const mockUserService = {
  getUsers: jest.fn(() => Promise.resolve({
    users: [mockUser, mockAdminUser],
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1
  })),
  
  getUser: jest.fn((id: string) => Promise.resolve(
    id === 'admin-1' ? mockAdminUser : mockUser
  )),
  
  updateUser: jest.fn((id: string, data: any) => Promise.resolve({
    id,
    ...data
  })),
  
  deleteUser: jest.fn((id: string) => Promise.resolve({ success: true })),
  
  createUser: jest.fn((data: any) => Promise.resolve({
    id: 'new-user',
    ...data
  }))
};

// API Service Mock
export const mockApiService = {
  get: jest.fn((url: string) => {
    if (url.includes('/products')) return Promise.resolve({ data: mockProducts });
    if (url.includes('/orders')) return Promise.resolve({ data: mockOrders });
    if (url.includes('/users')) return Promise.resolve({ data: [mockUser] });
    return Promise.resolve({ data: {} });
  }),
  
  post: jest.fn((url: string, data: any) => Promise.resolve({ 
    data: { id: 'new-item', ...data } 
  })),
  
  put: jest.fn((url: string, data: any) => Promise.resolve({ 
    data: { ...data } 
  })),
  
  delete: jest.fn(() => Promise.resolve({ data: { success: true } })),
  
  patch: jest.fn((url: string, data: any) => Promise.resolve({ 
    data: { ...data } 
  }))
};

// Email Service Mock
export const mockEmailService = {
  sendWelcomeEmail: jest.fn(() => Promise.resolve({ success: true })),
  sendOrderConfirmation: jest.fn(() => Promise.resolve({ success: true })),
  sendPasswordReset: jest.fn(() => Promise.resolve({ success: true })),
  sendOrderStatusUpdate: jest.fn(() => Promise.resolve({ success: true }))
};

// Performance Testing Mocks
export const mockLargeDatasets = {
  products: generateMockProducts(100),
  orders: generateMockOrders(50)
};

// Error Simulation Mocks
export const mockErrorScenarios = {
  networkError: () => Promise.reject(new Error('Network Error')),
  serverError: () => Promise.reject({ 
    response: { status: 500, data: { message: 'Internal Server Error' } } 
  }),
  validationError: () => Promise.reject({ 
    response: { status: 400, data: { message: 'Validation Error' } } 
  }),
  authError: () => Promise.reject({ 
    response: { status: 401, data: { message: 'Unauthorized' } } 
  }),
  notFoundError: () => Promise.reject({ 
    response: { status: 404, data: { message: 'Not Found' } } 
  })
};

// Reset all mocks function
export const resetAllMocks = () => {
  Object.values(mockProductService).forEach(mock => {
    if (jest.isMockFunction(mock)) mock.mockClear();
  });
  Object.values(mockOrderService).forEach(mock => {
    if (jest.isMockFunction(mock)) mock.mockClear();
  });
  Object.values(mockAuthService).forEach(mock => {
    if (jest.isMockFunction(mock)) mock.mockClear();
  });
  Object.values(mockUserService).forEach(mock => {
    if (jest.isMockFunction(mock)) mock.mockClear();
  });
  Object.values(mockApiService).forEach(mock => {
    if (jest.isMockFunction(mock)) mock.mockClear();
  });
};