/**
 * Error handling utilities
 */

import axios, { AxiosError } from 'axios';

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Format error message from various error types
 * @param error The error to format
 */
export function formatErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (axios.isAxiosError(error)) {
    return formatAxiosError(error);
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}

/**
 * Format Axios error into user-friendly message
 * @param error The Axios error
 */
export function formatAxiosError(error: AxiosError): string {
  if (error.response) {
    // The request was made and the server responded with an error status
    const data = error.response.data as any;
    
    if (data?.message) {
      return data.message;
    }
    
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error ${error.response.status}: ${error.response.statusText}`;
    }
  }
  
  if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your connection.';
  }
  
  // Something happened in setting up the request
  return error.message || 'An error occurred while processing your request.';
}

/**
 * Log error to console in development mode
 * @param error The error to log
 * @param context Optional context information
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  }
}

/**
 * Handle form validation errors
 * @param error The error from form validation
 */
export function handleFormErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (axios.isAxiosError(error) && error.response?.data?.errors) {
    const validationErrors = error.response.data.errors;
    
    // Map backend validation errors to form fields
    Object.keys(validationErrors).forEach(field => {
      errors[field] = Array.isArray(validationErrors[field]) 
        ? validationErrors[field][0] 
        : validationErrors[field];
    });
  }
  
  return errors;
}

/**
 * Global error handler for uncaught exceptions
 * @param error The uncaught error
 */
export function globalErrorHandler(error: Error): void {
  logError(error, 'Uncaught Exception');
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTrackingService(error);
  }
}

// Set up global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    globalErrorHandler(event.error);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    globalErrorHandler(new Error(event.reason || 'Unhandled Promise Rejection'));
  });
}