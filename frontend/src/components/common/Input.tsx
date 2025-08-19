import React, { useState, useCallback } from 'react';
import { validateAndSanitizeInput } from '../../utils/security';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  validationType?: 'email' | 'password' | 'text' | 'phone' | 'url';
  maxLength?: number;
  sanitize?: boolean;
  onValidatedChange?: (value: string, isValid: boolean, errors: string[]) => void;
};

const Input = ({ 
  label, 
  error, 
  className = '', 
  validationType = 'text',
  maxLength = 1000,
  sanitize = true,
  onValidatedChange,
  onChange,
  id,
  ...props 
}: InputProps) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Generate a unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseStyles = 'w-full px-4 py-2 rounded-md bg-[#2d2d2d] text-white border border-[#404040] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35] disabled:opacity-50 transition-colors';

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (sanitize) {
      const validation = validateAndSanitizeInput(value, validationType, maxLength);
      setValidationErrors(validation.errors);
      
      // Update the input value with sanitized version
      if (validation.sanitized !== value) {
        e.target.value = validation.sanitized;
      }
      
      // Call the validated change handler if provided
      if (onValidatedChange) {
        onValidatedChange(validation.sanitized, validation.isValid, validation.errors);
      }
    }
    
    // Call the original onChange handler
    if (onChange) {
      onChange(e);
    }
  }, [sanitize, validationType, maxLength, onValidatedChange, onChange]);

  const hasErrors = error || validationErrors.length > 0;
  const displayError = error || validationErrors[0];

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[#cccccc] mb-1">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        onChange={handleChange}
        maxLength={maxLength}
        className={`${baseStyles} ${hasErrors ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
        // Security attributes
        autoComplete={props.type === 'password' ? 'current-password' : props.autoComplete}
        spellCheck={props.type === 'password' ? false : props.spellCheck}
      />
      {hasErrors && (
        <p className="mt-1 text-sm text-red-400">{displayError}</p>
      )}
      {validationErrors.length > 1 && (
        <ul className="mt-1 text-xs text-red-300">
          {validationErrors.slice(1).map((err, index) => (
            <li key={index}>• {err}</li>
          ))}
        </ul>
      )}
      {maxLength && props.value && (
        <p className="mt-1 text-xs text-[#888888] text-right">
          {String(props.value).length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default Input; 