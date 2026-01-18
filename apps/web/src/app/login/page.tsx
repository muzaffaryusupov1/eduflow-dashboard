'use client';

import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { apiLogin } from '@/lib/api-client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('owner@eduflow.dev');
  const [password, setPassword] = useState('Owner123!');

  const mutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      login(data);
      toast({ title: 'Welcome back', description: 'Signed in successfully.' });
      router.push('/');
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials.',
        variant: 'destructive'
      });
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center gap-10 px-6">
        <div className="flex-1 space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            EduFlow
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Run your education center with calm precision.
          </h1>
          <p className="text-base text-muted-foreground">
            Sign in to manage classes, teachers, and billing in one unified
            workspace.
          </p>
        </div>
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Sign in
            </h2>
            <p className="text-sm text-muted-foreground">
              Use your owner or admin credentials.
            </p>
          </div>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate({ email, password });
            }}
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
