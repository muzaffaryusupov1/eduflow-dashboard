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
import { apiForgotPassword } from '@/lib/api-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formScheme = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

type FormScheme = z.infer<typeof formScheme>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormScheme>({
    resolver: zodResolver(formScheme),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const mutation = useMutation({
    mutationFn: (email: string) => apiForgotPassword(email),
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Reset request sent. Ask your administrator for the reset code.');
    },
    onError: (error) => {
      toast.error('Could not request password reset.', {
        closeButton: true,
        description: error?.message,
      });
    },
  });

  const onSubmit = (data: FormScheme) => {
    mutation.mutate(data.email);
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Forgot password</h1>
                <p className="text-muted-foreground">
                  Enter your account email to request a password reset code.
                </p>
              </div>

              {submitted ? (
                <div className="space-y-6">
                  <div className="rounded-lg bg-accent/50 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Request submitted</p>
                    <p>
                      If an account exists for that email, a reset code has been issued. Contact
                      your administrator to receive the code, then continue.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="w-full h-11"
                    onClick={() => router.push('/reset-password')}
                  >
                    I have a code
                  </Button>
                  <Link
                    href="/login"
                    className="block text-center text-sm text-primary hover:text-accent font-medium"
                  >
                    Back to sign in
                  </Link>
                </div>
              ) : (
                <Form {...form}>
                  <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
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
                      {mutation.isPending ? 'Sending...' : 'Send reset request'}
                    </Button>

                    <Link
                      href="/login"
                      className="block text-center text-sm text-primary hover:text-accent font-medium"
                    >
                      Back to sign in
                    </Link>
                  </form>
                </Form>
              )}
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
              We&apos;ll get you back in quickly.
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Reset codes are issued securely and expire within an hour.
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
