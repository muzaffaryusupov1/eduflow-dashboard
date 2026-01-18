'use client';

import { ToastProvider as RadixToastProvider } from '@radix-ui/react-toast';
import {
  Toast,
  ToastDescription,
  ToastTitle,
  ToastViewport
} from './toast';
import { useToast } from './use-toast';
import { cn } from '@/lib/utils';

function ToastRenderer() {
  const { toasts, dismiss } = useToast();

  return (
    <RadixToastProvider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onOpenChange={(open) => {
            if (!open) {
              dismiss(toast.id);
            }
          }}
          className={cn(
            toast.variant === 'destructive'
              ? 'border-red-200 bg-red-50'
              : undefined
          )}
        >
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>
        </Toast>
      ))}
      <ToastViewport />
    </RadixToastProvider>
  );
}

export function Toaster() {
  return <ToastRenderer />;
}
