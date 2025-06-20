
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="px-4 py-4 sm:px-6 border-b border-slate-200 flex justify-between items-center">
          {title && <h3 className="text-lg leading-6 font-semibold text-slate-900">{title}</h3>}
          {actions && <div className="ml-4 flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
    