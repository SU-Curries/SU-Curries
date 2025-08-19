import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  destructive?: boolean;
};

const Button = ({ variant = 'primary', size = 'medium', children, className = '', destructive = false, ...props }: ButtonProps) => {
  const sizeStyles = {
    small: 'px-3 py-2 text-sm min-h-[32px]',
    medium: 'px-5 py-3 min-h-[44px]',
    large: 'px-6 py-4 text-lg min-h-[48px]',
  };
  
  const baseStyles = `rounded-md font-medium transition-all duration-150 ease-out transform ${sizeStyles[size]}`;

  const getVariantStyles = () => {
    if (destructive) {
      return {
        primary: 'bg-[#ef4444] text-white border border-[#ef4444] shadow-[0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.35)] hover:ring-2 hover:ring-[#ef4444] hover:ring-opacity-50 active:scale-[0.98] active:shadow-[0_1px_2px_rgba(0,0,0,0.35)] disabled:bg-[#1a1a1a] disabled:text-[#666666] disabled:border-[#404040] disabled:shadow-none disabled:cursor-not-allowed',
        secondary: 'bg-[#2d2d2d] text-white border border-[#404040] shadow-[0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.35)] hover:bg-[#2f2f2f] hover:ring-1 hover:ring-[#ef4444] hover:ring-inset active:scale-[0.98] active:shadow-[0_1px_2px_rgba(0,0,0,0.35)] active:bg-[#2d2d2d] active:ring-2 active:ring-[#ef4444] active:ring-opacity-20 disabled:bg-[#1a1a1a] disabled:text-[#666666] disabled:border-[#404040] disabled:shadow-none disabled:cursor-not-allowed',
        ghost: 'bg-transparent text-white border border-transparent shadow-none hover:border-[#404040] hover:bg-[#2d2d2d] hover:bg-opacity-50 hover:ring-1 hover:ring-[#ef4444] active:scale-[0.98] active:bg-[#2d2d2d] active:bg-opacity-20 disabled:text-[#666666] disabled:cursor-not-allowed disabled:opacity-50',
      };
    }
    return {
      primary: 'bg-[#ff6b35] text-white border border-[#ff6b35] shadow-[0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.35)] hover:ring-2 hover:ring-[#ff6b35] hover:ring-opacity-50 active:scale-[0.98] active:shadow-[0_1px_2px_rgba(0,0,0,0.35)] disabled:bg-[#1a1a1a] disabled:text-[#666666] disabled:border-[#404040] disabled:shadow-none disabled:cursor-not-allowed',
      secondary: 'bg-[#2d2d2d] text-white border border-[#404040] shadow-[0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.35)] hover:bg-[#2f2f2f] hover:ring-1 hover:ring-[#ff6b35] hover:ring-inset active:scale-[0.98] active:shadow-[0_1px_2px_rgba(0,0,0,0.35)] active:bg-[#2d2d2d] active:ring-2 active:ring-[#ff6b35] active:ring-opacity-20 disabled:bg-[#1a1a1a] disabled:text-[#666666] disabled:border-[#404040] disabled:shadow-none disabled:cursor-not-allowed',
      ghost: 'bg-transparent text-white border border-transparent shadow-none hover:border-[#404040] hover:bg-[#2d2d2d] hover:bg-opacity-50 active:scale-[0.98] active:bg-[#2d2d2d] active:bg-opacity-20 disabled:text-[#666666] disabled:cursor-not-allowed disabled:opacity-50',
      danger: 'bg-[#ef4444] text-white border border-[#ef4444] shadow-[0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.35)] hover:ring-2 hover:ring-[#ef4444] hover:ring-opacity-50 active:scale-[0.98] active:shadow-[0_1px_2px_rgba(0,0,0,0.35)] disabled:bg-[#1a1a1a] disabled:text-[#666666] disabled:border-[#404040] disabled:shadow-none disabled:cursor-not-allowed',
      warning: 'bg-[#f59e0b] text-white border border-[#f59e0b] shadow-[0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.35)] hover:ring-2 hover:ring-[#f59e0b] hover:ring-opacity-50 active:scale-[0.98] active:shadow-[0_1px_2px_rgba(0,0,0,0.35)] disabled:bg-[#1a1a1a] disabled:text-[#666666] disabled:border-[#404040] disabled:shadow-none disabled:cursor-not-allowed',
    };
  };
  
  const variantStyles = getVariantStyles();

  return (
    <button
      {...props}
      className={`${baseStyles} ${variantStyles[variant]} focus:outline-none active:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 