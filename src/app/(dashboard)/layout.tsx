import { ReactNode } from "react";
import { getCurrentBroker } from "@/lib/supabase/get-user";
import { logout } from "@/app/actions/auth";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
    const broker = await getCurrentBroker();
    const profile = broker?.profile;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-semibold">Broker Diary</h1>

            <p className="text-sm text-muted-foreground">
              {profile?.full_name ?? "Broker"}
            </p>
          </div>

          <form action={logout}>
            <button className="text-sm font-medium text-primary">
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20">
        {children}
      </main>

      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}