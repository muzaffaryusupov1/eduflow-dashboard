import { ProtectedLayout } from '@/components/protected-layout';

export default function ProtectedRootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
