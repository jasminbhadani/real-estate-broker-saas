"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border p-6 shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            Real Estate Diary
          </h1>

          <p className="text-sm text-muted-foreground">
            Property, clients and follow-ups —
            all in one place.
          </p>
        </div>

        <Button
          className="w-full h-12 text-base"
          onClick={handleGoogleLogin}
        >
        <Button
            className="w-full h-12 text-base"
            onClick={handleGoogleLogin}
            >
            <span className="mr-2">G</span>
            Continue with Google
            </Button>
        </Button>
      </div>
    </main>
  );
}