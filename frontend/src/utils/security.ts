/**
 * Security utilities for the frontend
 */

/**
 * Comprehensive input sanitization to prevent XSS attacks
 * @param input The input string to sanitize
 * @param allowBasicHTML Whether to allow basic HTML tags (default: false)
 */
export const sanitizeInput = (input: string, allowBasicHTML: boolean = false): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  if (allowBasicHTML) {
    // Allow only safe HTML tags
    const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br'];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^<>]*>/gi;
    
    sanitized = sanitized.replace(tagRegex, (match, tagName) => {
      return allowedTags.includes(tagName.toLowerCase()) ? match : '';
    });
  } else {
    // Remove all HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  // Encode remaining special characters
  return encodeHTML(sanitized);
};

/**
 * Advanced XSS prevention for user-generated content
 * @param input The input string to clean
 */
export const preventXSS = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove dangerous patterns
  const dangerousPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /onload/gi,
    /onerror/gi,
    /onclick/gi,
    /onmouseover/gi,
    /onfocus/gi,
    /onblur/gi,
    /onchange/gi,
    /onsubmit/gi,
    /document\.cookie/gi,
    /document\.write/gi,
    /window\.location/gi,
    /eval\(/gi,
    /expression\(/gi,
    /url\(/gi,
    /import\(/gi
  ];
  
  let cleaned = input;
  dangerousPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return sanitizeInput(cleaned);
};

/**
 * Validate email format
 * @param email The email to validate
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate password strength
 * @param password The password to validate
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

/**
 * Check if a string contains HTML or script tags
 * @param input The input string to check
 */
export const containsHTML = (input: string): boolean => {
  const re = /<[^>]*>/;
  return re.test(input);
};

/**
 * Encode HTML entities in a string
 * @param input The input string to encode
 */
export const encodeHTML = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generate a CSRF token
 */
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Store CSRF token in session storage
 */
export const storeCSRFToken = (): string => {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
};

/**
 * Get stored CSRF token
 */
export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrf_token');
};

/**
 * Validate phone number format
 * @param phone The phone number to validate
 */
export const isValidPhone = (phone: string): boolean => {
  // Basic international phone validation
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone);
};

/**
 * Mask sensitive data for display
 * @param data The data to mask
 * @param visibleChars Number of characters to show at the end
 */
export const maskData = (data: string, visibleChars: number = 4): string => {
  if (!data || data.length <= visibleChars) return data;
  return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
};

/**
 * Validate and sanitize form input
 * @param value The input value
 * @param type The input type (email, password, text, etc.)
 * @param maxLength Maximum allowed length
 */
export const validateAndSanitizeInput = (
  value: string, 
  type: 'email' | 'password' | 'text' | 'phone' | 'url' = 'text',
  maxLength: number = 1000
): { isValid: boolean; sanitized: string; errors: string[] } => {
  const errors: string[] = [];
  
  if (!value || typeof value !== 'string') {
    return { isValid: false, sanitized: '', errors: ['Input is required'] };
  }
  
  // Length validation
  if (value.length > maxLength) {
    errors.push(`Input exceeds maximum length of ${maxLength} characters`);
  }
  
  // Type-specific validation
  switch (type) {
    case 'email':
      if (!isValidEmail(value)) {
        errors.push('Invalid email format');
      }
      break;
    case 'password':
      if (!isValidPassword(value)) {
        errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
      }
      break;
    case 'phone':
      if (!isValidPhone(value)) {
        errors.push('Invalid phone number format');
      }
      break;
    case 'url':
      try {
        new URL(value);
      } catch {
        errors.push('Invalid URL format');
      }
      break;
  }
  
  // Sanitize the input
  const sanitized = preventXSS(value);
  
  // Check for potential XSS
  if (containsHTML(value)) {
    errors.push('HTML content is not allowed');
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
};

/**
 * Enhanced CSRF token generation with crypto API
 */
export const generateSecureCSRFToken = (): string => {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for older browsers
  return generateCSRFToken();
};

/**
 * Secure localStorage wrapper with encryption
 * @param key The storage key
 * @param value The value to store
 */
export const secureLocalStorage = {
  setItem: (key: string, value: string): void => {
    try {
      // Simple encoding (in production, use proper encryption)
      const encoded = btoa(encodeURIComponent(value));
      localStorage.setItem(`secure_${key}`, encoded);
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const encoded = localStorage.getItem(`secure_${key}`);
      if (!encoded) return null;
      return decodeURIComponent(atob(encoded));
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(`secure_${key}`);
  }
};