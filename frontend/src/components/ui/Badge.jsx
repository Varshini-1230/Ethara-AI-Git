import React from 'react';

const Badge = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-amber-100 text-amber-800 border-amber-200',
    red: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
