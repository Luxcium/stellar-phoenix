'use client';

import { ButtonHTMLAttributes } from 'react';

interface PortalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export default function PortalButton({
  children,
  className = '',
  variant = 'default',
  ...props
}: PortalButtonProps) {
  const baseStyles =
    'rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline:
      'border border-border hover:bg-accent hover:text-accent-foreground',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
