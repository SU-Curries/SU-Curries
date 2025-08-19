import {
  sanitizeInput,
  isValidEmail,
  isValidPassword,
  containsHTML,
  encodeHTML,
  isValidPhone,
  maskData
} from '../security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should sanitize HTML input', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeInput(input);
      expect(result).not.toContain('<script>');
    });

    it('should preserve safe text', () => {
      const input = 'Hello World';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello World');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('StrongPass123')).toBe(true);
      expect(isValidPassword('MySecure1')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('weak')).toBe(false);
      expect(isValidPassword('password')).toBe(false);
      expect(isValidPassword('12345678')).toBe(false);
    });
  });

  describe('containsHTML', () => {
    it('should detect HTML tags', () => {
      expect(containsHTML('<div>test</div>')).toBe(true);
      expect(containsHTML('<script>')).toBe(true);
    });

    it('should return false for plain text', () => {
      expect(containsHTML('plain text')).toBe(false);
    });
  });

  describe('encodeHTML', () => {
    it('should encode HTML entities', () => {
      const input = '<script>alert("test")</script>';
      const result = encodeHTML(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;');
    });
  });

  describe('isValidPhone', () => {
    it('should validate phone numbers', () => {
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('1234567890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('1')).toBe(false); // Too short (only 1 digit)
      expect(isValidPhone('abc123')).toBe(false);
      expect(isValidPhone('0123456789')).toBe(false); // Starts with 0
      expect(isValidPhone('')).toBe(false); // Empty string
    });
  });

  describe('maskData', () => {
    it('should mask sensitive data', () => {
      expect(maskData('1234567890', 4)).toBe('******7890');
      expect(maskData('test@email.com', 4)).toBe('**********.com'); // Shows last 4 characters: '.com'
    });

    it('should handle short strings', () => {
      expect(maskData('123', 4)).toBe('123');
    });
  });
});