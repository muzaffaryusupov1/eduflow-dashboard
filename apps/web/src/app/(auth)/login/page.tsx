'use client';

import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { apiLogin } from '@/lib/api-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formScheme = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormScheme = z.infer<typeof formScheme>;

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const form = useForm<FormScheme>({
    resolver: zodResolver(formScheme),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      login(data);
      toast.success('Successfully signed in!');
      router.push('/');
    },
    onError: (error) => {
      toast.error('Login failed. Please check your credentials and try again.', {
        closeButton: true,
        description: error?.message,
      });
    }
  });

  const onFormSubmit = (data: FormScheme) => {
    mutation.mutate({ email: data.email, password: data.password });
  }

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
          <Form {...form}>
          <form
            className="mt-6 space-y-4"
            onSubmit={form.handleSubmit(onFormSubmit)}
          >
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          </Form>

        </div>
      </div>
    </div>
  );
}
