import { MainLayout } from "@/components/layout/main-layout";

// Force dynamic rendering and disable loading UI
export const dynamic = 'force-dynamic';

// Disable Next.js page transition animations
export const experimental_ppr = false;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
