import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <label className="space-y-2 text-sm">
        {label && <span className="text-ink-700">{label}</span>}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-700/60 focus:border-ink-900 focus:ring-2 focus:ring-ink-900/15',
            className
          )}
          ref={ref}
          {...props}
        />
      </label>
    );
  }
);
Input.displayName = 'Input';

export { Input };
