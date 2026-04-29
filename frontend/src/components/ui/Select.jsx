import React from 'react';
import clsx from 'clsx';

export default function Select({ label, error, className = '', id, children, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={clsx(
          'w-full rounded-lg bg-brand-surface border border-brand-border text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-colors appearance-none',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
