import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("OAuth error:", error);
    const {
        data: { user },
        } = await supabase.auth.getUser();

        if (user) {
        await supabase.from("profiles").upsert(
            {
            id: user.id,
            full_name: user.user_metadata.full_name ?? "",
            preferred_language: "gu",
            },
            {
            onConflict: "id",
            }
        );
        }
    }

  return NextResponse.redirect(
    new URL("/dashboard", request.url)
  );
}