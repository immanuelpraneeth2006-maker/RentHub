import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-[#e0a96d] animate-spin`} />
      {text && <p className="text-sm font-medium text-amber-200/70 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
