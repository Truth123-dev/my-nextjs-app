"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Route guarding execution flow
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <svg
          className="animate-spin h-8 w-8 text-sky-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-sky-500 flex items-center justify-center text-white font-semibold text-base">
            L
          </div>
          <span className="font-medium text-slate-800">My Workspace</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user.email}</span>
          <button
            onClick={logout}
            className="text-xs font-medium text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Welcome back, {user.name}
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
          This workspace implements a complete React Context hydration layer to
          safely maintain browser sessions.
        </p>
        <div className="p-6 border border-slate-100 rounded-lg shadow-sm bg-white inline-block">
          <p className="text-xs text-sky-600 font-mono tracking-wider uppercase mb-1">
            Active Token Verification
          </p>
          <pre className="text-left text-xs bg-slate-50 p-4 rounded border border-slate-150 text-slate-700">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}
