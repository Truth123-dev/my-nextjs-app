

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { loginWithEmail, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email address is required.");
      return;
    }

    const success = await loginWithEmail(email);
    if (success) {
      router.push("/");
    } else {
      setError("Please provide a valid email format.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-sky-50/30 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
        {/* Sky blue logo indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-10 w-10 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-xl">
            L
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your issues and workspaces
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email address"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            disabled={isLoading}
          />

          <Button type="submit" isLoading={isLoading}>
            Continue with Email
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* Mock OAuth Actions */}
        <button
          onClick={() => loginWithEmail("google-user@example.com").then(() => router.push("/"))}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-md
            text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors focus-ring"
        >
          {/* Simple Google Icon SVG */}
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8 12.725a5.79 5.79 0 0 1 5.99-5.79c2.44 0 4.38 1.439 5.232 2.656l3.308-3.308C20.25 4.1 16.7 2 12.24 2 6.58 2 2 6.58 2 12.24s4.58 10.24 10.24 10.24c5.79 0 9.87-3.951 9.87-9.87 0-.711-.08-1.218-.23-1.685H12.24Z"
            />
          </svg>
          Google
        </button>
      </div>
    </div>
  );
}
