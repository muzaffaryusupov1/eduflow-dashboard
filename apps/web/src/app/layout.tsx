import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Geist, Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistHeading = Geist({ subsets: ['latin'], variable: '--font-heading' });

const manrope = Manrope({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'EduFlow',
  description: 'EduFlow education center management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(manrope.variable, geistHeading.variable, "font-sans", geist.variable)}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
