import React from 'react';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`
            block w-full rounded-xl border bg-white px-4 py-2.5 text-gray-900 text-sm font-medium
            transition-all duration-200 outline-none
            ${Icon ? 'pl-11' : 'pl-4'}
            ${error 
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/10' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
            }
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
