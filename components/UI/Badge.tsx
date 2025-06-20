
import React from 'react';

interface BadgeProps {
  count: number;
  className?: string;
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ count, className = '', size = 'md' }) => {
  if (count === 0) return null;

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
  }

  return (
    <span 
      className={`
        inline-flex items-center justify-center 
        font-bold leading-none text-red-100 bg-red-600 rounded-full
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default Badge;
    