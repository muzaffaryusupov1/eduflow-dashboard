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
import Link from 'next/link';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormValues {
  email: string;
  password: string;
}

interface Props {
  form: UseFormReturn<FormValues>;
  onFormSubmit: any;
  mutation: any;
}

const SignInForm: React.FC<Props> = ({ form, mutation, onFormSubmit }) => {
  return (
    <Card className="w-full border-0 shadow-lg">
      <div className="p-8 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your EduFlow admin dashboard</p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onFormSubmit)}>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-primary hover:text-accent font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg transition-all duration-200"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-center text-muted-foreground text-sm">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-primary hover:text-accent font-medium transition-colors">
              Create one
            </a>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SignInForm;
