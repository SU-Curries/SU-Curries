import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className = '' }: CardProps) => {
  const baseStyles = 'bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg shadow-lg overflow-hidden';

  return (
    <div className={`${baseStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card; 