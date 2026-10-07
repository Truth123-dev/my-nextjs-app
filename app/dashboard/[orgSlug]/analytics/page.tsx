"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface CurrencyAnalytics {
  currency: string;
  transaction_count: number;
  credits_total: number | string;
  debits_total: number | string;
  pending_count: number;
}

async function fetchAnalytics(orgSlug: string): Promise<CurrencyAnalytics[]> {
  const response = await fetch(
    `/api/v1/${encodeURIComponent(orgSlug)}/analytics`,
  );
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Unable to load analytics");
  return result.items;
}

export default function AnalyticsPage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["analytics", orgSlug],
    queryFn: () => fetchAnalytics(orgSlug),
    enabled: Boolean(orgSlug),
  });
  const formatCurrency = (amount: number | string, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      Number(amount),
    );

  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-emerald-800">
        {orgSlug.replaceAll("-", " ")}
      </p>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="text-sm text-slate-600">
        Ledger totals are grouped by account currency.
      </p>
      {isLoading ? (
        <p role="status" className="py-6 text-sm text-slate-500">
          Loading analytics…
        </p>
      ) : error ? (
        <div role="alert" className="space-y-3 py-4 text-sm text-rose-700">
          <p>{error.message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="font-medium underline"
          >
            {isRefetching ? "Retrying…" : "Retry"}
          </button>
        </div>
      ) : data?.length ? (
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {data.map((summary) => (
            <section
              key={summary.currency}
              className="grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div>
                <p className="text-xs uppercase text-slate-500">Currency</p>
                <p className="mt-1 font-semibold">{summary.currency}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Transactions</p>
                <p className="mt-1 font-semibold">
                  {summary.transaction_count}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Credits</p>
                <p className="mt-1 font-semibold">
                  {formatCurrency(summary.credits_total, summary.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">
                  Debits · pending
                </p>
                <p className="mt-1 font-semibold">
                  {formatCurrency(summary.debits_total, summary.currency)} ·{" "}
                  {summary.pending_count}
                </p>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="border-y border-slate-200 py-6 text-sm text-slate-600">
          No accounts or transactions to summarize yet.
        </p>
      )}
    </section>
  );
}
