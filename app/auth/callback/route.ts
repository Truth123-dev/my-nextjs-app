import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/DBsupabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = url.searchParams.get("next") ?? "/dashboard";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }

    console.error("Supabase auth callback exchange failed", error.message);
    return NextResponse.redirect(
      new URL("/login?error=auth_exchange_failed", url.origin),
    );
  }

  return NextResponse.redirect(
    new URL("/login?error=missing_auth_code", url.origin),
  );
}
