import React from 'react';

type ButtonVariant = 'default' | 'outline';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseClasses =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-white text-black hover:bg-gray-200',
  outline: 'border border-white/20 bg-transparent text-white hover:bg-white/10'
};

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />;
}
