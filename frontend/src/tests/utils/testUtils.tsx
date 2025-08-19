/**
 * Test Utilities
 * Custom render functions and test helpers
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

// Mock i18n config
const mockI18n = {
  t: (key: string, defaultValue?: string) => defaultValue || key,
  changeLanguage: jest.fn(),
  language: 'en',
  languages: ['en'],
  isInitialized: true,
  hasResourceBundle: jest.fn(() => true),
  getResourceBundle: jest.fn(() => ({})),
  addResourceBundle: jest.fn(),
  removeResourceBundle: jest.fn(),
  loadNamespaces: jest.fn(),
  loadLanguages: jest.fn(),
  dir: jest.fn(() => 'ltr'),
  format: jest.fn((value) => value),
  exists: jest.fn(() => true),
  getFixedT: jest.fn(() => (key: string) => key),
  services: {
    resourceStore: {
      data: {},
    },
  },
  options: {},
  isLanguageChangingTo: jest.fn(() => false),
  emit: jest.fn(),
  off: jest.fn(),
  on: jest.fn(),
  store: {
    on: jest.fn(),
    off: jest.fn(),
  },
  react: {
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    useSuspense: true,
  },
};

// Mock contexts for testing - these will be replaced by enhanced versions below

// All providers wrapper
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={mockI18n as any}>
        <MockThemeProvider>
          <MockAuthProvider>
            <MockCartProvider>
              {children}
            </MockCartProvider>
          </MockAuthProvider>
        </MockThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Export test utilities will be defined below

// Enhanced Mock Providers with proper value passing
const MockThemeProvider: React.FC<{ children: React.ReactNode; value?: any }> = ({
  children,
  value
}) => {
  const mockThemeValue = value || {
    theme: 'light' as const,
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  };

  return (
    <div data-testid="mock-theme-provider">
      {children}
    </div>
  );
};

const MockAuthProvider: React.FC<{ children: React.ReactNode; value?: any }> = ({
  children,
  value
}) => {
  const mockAuthValue = value || {
    user: null,
    isAuthenticated: false,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    updateUser: jest.fn(),
  };

  return (
    <div data-testid="mock-auth-provider">
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

const MockCartProvider: React.FC<{ children: React.ReactNode; value?: any }> = ({
  children,
  value
}) => {
  const mockCartValue = value || {
    items: [],
    cartCalculation: null,
    loading: false,
    itemCount: 0,
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    calculateCart: jest.fn(),
  };



  return (
    <div data-testid="mock-cart-provider">
      <CartContext.Provider value={mockCartValue}>
        {children}
      </CartContext.Provider>
    </div>
  );
};

// Enhanced Test Wrapper with proper mock integration
export const TestWrapper: React.FC<{
  children: React.ReactNode;
  authValue?: any;
  cartValue?: any;
  themeValue?: any;
}> = ({ children, authValue, cartValue, themeValue }) => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={mockI18n as any}>
        <MockThemeProvider value={themeValue}>
          <MockAuthProvider value={authValue}>
            <MockCartProvider value={cartValue}>
              {children}
            </MockCartProvider>
          </MockAuthProvider>
        </MockThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

// Custom render with specific providers
export const renderWithAuth = (
  ui: React.ReactElement,
  authValue?: any,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestWrapper authValue={authValue}>
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: AuthWrapper, ...options });
};

export const renderWithCart = (
  ui: React.ReactElement,
  cartValue?: any,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const CartWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestWrapper cartValue={cartValue}>
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: CartWrapper, ...options });
};

// Enhanced render with all providers
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    authValue,
    cartValue,
    themeValue,
    ...options
  }: {
    authValue?: any;
    cartValue?: any;
    themeValue?: any;
  } & Omit<RenderOptions, 'wrapper'> = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestWrapper
      authValue={authValue}
      cartValue={cartValue}
      themeValue={themeValue}
    >
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Test helpers
export const createMockEvent = (overrides = {}) => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: { value: '' },
  ...overrides,
});

export const createMockFile = (name = 'test.jpg', type = 'image/jpeg') => {
  return new File(['test'], name, { type });
};

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  (window as any).IntersectionObserver = mockIntersectionObserver;
};

export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  (window as any).ResizeObserver = mockResizeObserver;
};

export const mockWindowConfirm = (returnValue = true) => {
  (window as any).confirm = jest.fn(() => returnValue);
};

export const mockPerformanceAPI = () => {
  const mockFn = () => jest.fn();
  (window as any).performance = {
    ...window.performance,
    mark: mockFn(),
    measure: mockFn(),
    getEntriesByName: mockFn(() => []),
    getEntriesByType: mockFn(() => []),
    clearMarks: mockFn(),
    clearMeasures: mockFn(),
    now: mockFn(() => Date.now()),
  };
};

// Async test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const flushPromises = () => {
  return new Promise(resolve => setImmediate(resolve));
};

// Mock API responses
export const mockApiResponse = (data: any, delay = 0) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (message = 'API Error', status = 500, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message);
      (error as any).status = status;
      reject(error);
    }, delay);
  });
};

// Form testing helpers
export const fillForm = async (form: HTMLFormElement, data: Record<string, string>) => {
  const { fireEvent } = await import('@testing-library/react');

  Object.entries(data).forEach(([name, value]) => {
    const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (input) {
      fireEvent.change(input, { target: { value } });
    }
  });
};

export const submitForm = async (form: HTMLFormElement) => {
  const { fireEvent } = await import('@testing-library/react');
  fireEvent.submit(form);
};

// Accessibility testing helpers
export const checkAccessibility = async (container: HTMLElement) => {
  const { axe, toHaveNoViolations } = await import('jest-axe');
  expect.extend(toHaveNoViolations);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

// Performance testing helpers
export const measureRenderTime = (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

// Mock data generators
export const generateMockProducts = (count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `product-${index + 1}`,
    name: `Product ${index + 1}`,
    description: `Description for product ${index + 1}`,
    price: (index + 1) * 10,
    category: 'main',
    image: `/images/product-${index + 1}.jpg`,
    available: true,
    spiceLevel: 'medium',
    allergens: [],
    nutritionalInfo: {
      calories: 400 + index * 50,
      protein: 20 + index * 2,
      carbs: 30 + index * 3,
      fat: 15 + index * 2,
    },
  }));
};

export const generateMockOrders = (count = 3) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `order-${index + 1}`,
    orderNumber: `ORD-${String(index + 1).padStart(3, '0')}`,
    customerId: '1',
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    items: [
      {
        id: `item-${index + 1}`,
        productId: `product-${index + 1}`,
        name: `Product ${index + 1}`,
        price: (index + 1) * 10,
        quantity: 1,
      },
    ],
    subtotal: (index + 1) * 10,
    tax: (index + 1) * 1,
    deliveryFee: 3.99,
    total: (index + 1) * 10 + (index + 1) * 1 + 3.99,
    status: 'pending' as const,
    paymentStatus: 'pending' as const,
    paymentMethod: 'card',
    createdAt: new Date(),
    updatedAt: new Date(),
    statusHistory: [],
  }));
};

// Custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAccessible(): R;
      toHaveLoadingState(): R;
      toHaveErrorState(): R;
    }
  }
}

// Add custom matchers
expect.extend({
  toBeAccessible(received) {
    // Check for basic accessibility attributes
    const hasAriaLabel = received.hasAttribute('aria-label');
    const hasRole = received.hasAttribute('role');
    const hasTabIndex = received.hasAttribute('tabindex');

    const pass = hasAriaLabel || hasRole || hasTabIndex;

    return {
      message: () => `Expected element to have accessibility attributes`,
      pass,
    };
  },

  toHaveLoadingState(received) {
    const hasLoadingText = received.textContent?.includes('Loading');
    const hasLoadingClass = received.classList.contains('loading');
    const hasAriaLabel = received.getAttribute('aria-label')?.includes('loading');

    const pass = hasLoadingText || hasLoadingClass || hasAriaLabel;

    return {
      message: () => `Expected element to have loading state`,
      pass,
    };
  },

  toHaveErrorState(received) {
    const hasErrorText = received.textContent?.includes('Error');
    const hasErrorClass = received.classList.contains('error');
    const hasAriaLabel = received.getAttribute('aria-label')?.includes('error');

    const pass = hasErrorText || hasErrorClass || hasAriaLabel;

    return {
      message: () => `Expected element to have error state`,
      pass,
    };
  },
});