import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', hover = false }) => {
  const hoverEffect = hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-lg ${padding} ${hoverEffect} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
