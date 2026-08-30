'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { apiResetPassword } from '@/lib/api-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formScheme = z
  .object({
    token: z.string().min(1, 'Reset code is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormScheme = z.infer<typeof formScheme>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const form = useForm<FormScheme>({
    resolver: zodResolver(formScheme),
    mode: 'onChange',
    defaultValues: { token: '', newPassword: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: (input: { token: string; newPassword: string }) =>
      apiResetPassword(input.token, input.newPassword),
    onSuccess: () => {
      toast.success('Password reset. You can now sign in.');
      router.push('/login');
    },
    onError: (error) => {
      toast.error('Could not reset password.', {
        closeButton: true,
        description: error?.message,
      });
    },
  });

  const onSubmit = (data: FormScheme) => {
    mutation.mutate({ token: data.token, newPassword: data.newPassword });
  };

  return (
    <main className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <Link href="/login" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">E</span>
              </div>
              <span className="text-2xl font-bold text-foreground">EduFlow</span>
            </Link>
          </div>

          <Card className="w-full border-0 shadow-lg">
            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Reset password</h1>
                <p className="text-muted-foreground">
                  Enter the reset code from your administrator and choose a new password.
                </p>
              </div>

              <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reset code</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Paste your reset code"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="At least 8 characters"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm new password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Repeat new password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg transition-all duration-200"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Resetting...' : 'Reset password'}
                  </Button>

                  <Link
                    href="/login"
                    className="block text-center text-sm text-primary hover:text-accent font-medium"
                  >
                    Back to sign in
                  </Link>
                </form>
              </Form>
            </div>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/signin-bg-2.png"
            alt="Education dashboard"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
        </div>
        <div className="relative flex flex-col justify-between p-12 lg:p-16">
          <div></div>
          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Choose a strong password.
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Use at least 8 characters with a mix of letters, numbers, and symbols.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/60"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
    </main>
  );
}
