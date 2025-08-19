import React from 'react';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  as: Component = 'span',
  className = ''
}) => {
  return (
    <Component 
      className={`sr-only ${className}`}
      aria-hidden="false"
    >
      {children}
    </Component>
  );
};

export default ScreenReaderOnly;