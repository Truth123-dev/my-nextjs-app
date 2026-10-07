import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { RealtimeNotificationBadge } from "@/components/modules/notifications/realtime-notification-badge";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-semibold tracking-wide">
            LEDGER WORKSPACE
          </Link>
          <div className="flex items-center gap-3">
            <RealtimeNotificationBadge />
            <SignOutButton />
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  );
}
