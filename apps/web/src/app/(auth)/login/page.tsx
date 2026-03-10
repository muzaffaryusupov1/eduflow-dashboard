'use client';

import { useAuth } from '@/components/auth-provider';
import { apiLogin } from '@/lib/api-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import SignInForm from './components/SignInForm';

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
    },
  });

  const onFormSubmit = (data: FormScheme) => {
    mutation.mutate({ email: data.email, password: data.password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="flex min-h-screen bg-background">
      {/* Left Column - Sign In Form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">E</span>
              </div>
              <span className="text-2xl font-bold text-foreground">EduFlow</span>
            </div>
          </div>

          {/* Sign In Form */}
          <SignInForm form={form} mutation={mutation} onFormSubmit={onFormSubmit} />
        </div>
      </div>

      {/* Right Column - Branding and Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 relative overflow-hidden">
        {/* Background Image */}
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

        {/* Content Overlay */}
        <div className="relative flex flex-col justify-between p-12 lg:p-16">
          <div></div>
          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Run your education center with calm precision.
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Sign in to manage classes, teachers, and billing in one unified workspace.
            </p>
          </div>

          {/* Bottom Decoration */}
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/60"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Mobile Right Side Content */}
      <div className="lg:hidden fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
    </main>
  );
}
