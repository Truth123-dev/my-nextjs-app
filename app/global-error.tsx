

"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en"><body className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-900">
      <main className="max-w-md space-y-4 rounded-lg border bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-slate-600">{error.message || "An unexpected error occurred."}</p>
        <button onClick={reset} className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white">Try again</button>
      </main>
    </body></html>
  );
}
