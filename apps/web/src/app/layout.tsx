import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from "next"
import { Nunito_Sans } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduFlow",
  description: "EduFlow education center management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunitoSans.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
