import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'info' | 'success';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-emerald-100 text-emerald-800',
    secondary: 'border-transparent bg-slate-100 text-slate-700',
    destructive: 'border-transparent bg-rose-100 text-rose-800',
    outline: 'border-slate-200 text-slate-700',
    warning: 'border-transparent bg-amber-100 text-amber-800',
    info: 'border-transparent bg-blue-100 text-blue-800',
    success: 'border-transparent bg-emerald-100 text-emerald-800',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
