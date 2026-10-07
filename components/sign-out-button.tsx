"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/DBsupabase/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    setError("");
    try {
      const { error: signOutError } = await createClient().auth.signOut();
      if (signOutError) throw signOutError;
      router.replace("/login");
      router.refresh();
    } catch (signOutError) {
      setError(
        signOutError instanceof Error
          ? signOutError.message
          : "Unable to sign out.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="flex items-center gap-3">
      {error && (
        <span role="alert" className="text-xs text-rose-600">
          {error}
        </span>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        disabled={pending}
      >
        {pending ? "Signing out…" : "Sign out"}
      </Button>
    </span>
  );
}
