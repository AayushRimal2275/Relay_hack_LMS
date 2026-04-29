import React from 'react';
import clsx from 'clsx';

const trackColors = {
  MERN: 'bg-blue-900 text-blue-300 border-blue-700',
  DevOps: 'bg-orange-900 text-orange-300 border-orange-700',
  QA: 'bg-purple-900 text-purple-300 border-purple-700',
  Design: 'bg-pink-900 text-pink-300 border-pink-700',
  'Data Science': 'bg-yellow-900 text-yellow-300 border-yellow-700',
};

const statusColors = {
  APPLIED: 'bg-gray-800 text-gray-300 border-gray-600',
  SHORTLISTED: 'bg-blue-900 text-blue-300 border-blue-700',
  INTERVIEW: 'bg-yellow-900 text-yellow-300 border-yellow-700',
  HIRED: 'bg-green-900 text-green-300 border-green-700',
  REJECTED: 'bg-red-900 text-red-300 border-red-700',
};

export default function Badge({ label, type = 'track', className = '' }) {
  const colorMap = type === 'status' ? statusColors : trackColors;
  const color = colorMap[label] || 'bg-gray-800 text-gray-300 border-gray-600';
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        color,
        className
      )}
    >
      {label}
    </span>
  );
}
