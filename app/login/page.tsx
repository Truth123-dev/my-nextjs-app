"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/DBsupabase/client";

function CallbackFailureMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error === "missing_auth_code") {
    return (
      <p role="alert" className="text-sm text-rose-700">
        The sign-in link didn’t include its code. Request a new link and open it
        again.
      </p>
    );
  }

  if (error === "auth_exchange_failed") {
    return (
      <p role="alert" className="text-sm text-rose-700">
        Supabase couldn’t verify this link. It may be expired, already used, or
        configured for a different redirect URL.
      </p>
    );
  }

  if (error === "session_missing") {
    return (
      <p role="alert" className="text-sm text-rose-700">
        You aren’t signed in yet. The email link may have expired or failed to
        establish your session.
      </p>
    );
  }

  if (error !== "auth_callback") return null;

  return (
    <p role="alert" className="text-sm text-rose-700">
      Sign-in could not be completed. Request a fresh link and try again.
    </p>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      setMessage(
        error ? error.message : "Check your email for a sign-in link.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to start sign in.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <section className="w-full max-w-md space-y-6 rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-emerald-800">
            LEDGER WORKSPACE
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            We’ll email you a secure sign-in link.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 w-full rounded-md border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <button
            type="submit"
            disabled={pending}
            className="h-10 w-full rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
          >
            {pending ? "Sending link…" : "Send sign-in link"}
          </button>
        </form>
        <Suspense fallback={null}>
          <CallbackFailureMessage />
        </Suspense>
        {message && (
          <p role="status" className="text-sm text-slate-600">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
