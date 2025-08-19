import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests since error boundaries are expected to catch errors
  const originalError = console.error;
  const originalWarn = console.warn;
  
  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
    expect(screen.getByText('Go to Homepage')).toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });
});