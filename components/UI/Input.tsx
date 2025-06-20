
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  Icon?: React.ElementType;
}

const Input: React.FC<InputProps> = ({ label, id, error, Icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          className={`
            block w-full px-3 py-2 border rounded-md 
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500'}
            focus:outline-none sm:text-sm
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
    