import React from 'react';
import clsx from 'clsx';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={clsx(
        'bg-brand-surface border border-brand-border rounded-xl p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
