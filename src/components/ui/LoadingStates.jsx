import React from 'react';
import { Loader2 } from 'lucide-react';

export const FullScreenLoading = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
      <p className="text-lg opacity-80">{message}</p>
    </div>
  </div>
);

export const InlineLoading = ({ message = "Loading...", size = "sm" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin mr-2`} />
      <span className="text-white/70">{message}</span>
    </div>
  );
};

export const ButtonLoading = ({ isLoading, children, loadingText = "Loading..." }) => (
  <>
    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
    {isLoading ? loadingText : children}
  </>
);

export const TableLoading = ({ columns = 4, rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="h-4 bg-white/10 rounded animate-pulse"></div>
        ))}
      </div>
    ))}
  </div>
);