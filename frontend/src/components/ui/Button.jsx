import React from 'react';
import clsx from 'clsx';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-brand-accent hover:bg-brand-accent-hover text-black font-semibold',
  secondary: 'bg-brand-surface hover:bg-[#222] text-white border border-brand-border',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold',
  ghost: 'bg-transparent hover:bg-brand-surface text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-bg disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
