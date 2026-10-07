"use client";

import { useParams } from "next/navigation";
import { useDeferredValue, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import type { Transaction } from "@/hooks/use-transactions";
import { useAccounts } from "@/hooks/use-accounts";
import { useRealtimeTransactions } from "@/hooks/use-realtime-transactions";
import { TransactionTable } from "@/components/modules/transactions/transaction-table";
import { TransactionTableSkeleton } from "@/components/modules/transactions/transaction-table-skeleton";
import { TransactionEmptyState } from "@/components/modules/transactions/transaction-empty-state";
import { TransactionFilters } from "@/components/modules/transactions/transaction-filters";
import { TransferModal } from "@/components/modules/transfer-modal";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState<Transaction["status"]>();
  const [sort, setSort] = useState<"created_at" | "amount">("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useAccounts(orgSlug);
  const account = accounts?.items[0];
  useRealtimeTransactions(account?.organization_id ?? "", orgSlug);
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useTransactions(orgSlug, {
      page,
      limit: 25,
      search: deferredSearch || undefined,
      status,
      sort,
      order,
    });
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 25));

  function handleSortChange(column: "created_at" | "amount") {
    if (sort === column)
      setOrder((current) => (current === "asc" ? "desc" : "asc"));
    else {
      setSort(column);
      setOrder("desc");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-slate-500">
            Ledger activity for {orgSlug.replaceAll("-", " ")}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoadingAccounts || Boolean(accountsError) || !account}
            className="bg-emerald-800 text-white hover:bg-emerald-900"
          >
            <PlusCircle className="h-4 w-4" /> New Transfer
          </Button>
        </div>
      </div>
      <TransactionFilters
        search={search}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />
      {accountsError && (
        <p role="alert" className="text-sm text-rose-700">
          {accountsError.message}
        </p>
      )}
      {account && (
        <p className="text-sm text-slate-600">
          Available balance:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: account.currency,
          }).format(Number(account.balance))}
        </p>
      )}
      {!isLoadingAccounts && !accountsError && !account && (
        <p role="status" className="text-sm text-slate-600">
          No account is set up for this organization yet.
        </p>
      )}
      {isError ? (
        <div
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 p-5 text-rose-800"
        >
          <p className="flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4" />
            {error instanceof Error
              ? error.message
              : "Could not load transactions"}
          </p>
          <Button variant="outline" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <TransactionTableSkeleton />
      ) : data?.items.length ? (
        <TransactionTable
          data={data.items}
          onSortChange={handleSortChange}
          sortColumn={sort}
          sortOrder={order}
        />
      ) : (
        <TransactionEmptyState
          onTriggerTransfer={() => setIsModalOpen(true)}
          canCreate={Boolean(account)}
        />
      )}
      {data && data.total > 25 && (
        <nav
          aria-label="Transaction pages"
          className="flex items-center justify-between border-t border-slate-200 pt-4"
        >
          <p className="text-sm text-slate-600">
            Page {data.page} of {totalPages} · {data.total} transactions
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft aria-hidden="true" size={16} /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              Next <ChevronRight aria-hidden="true" size={16} />
            </Button>
          </div>
        </nav>
      )}
      {account && (
        <TransferModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orgSlug={orgSlug}
          accountId={account.id}
        />
      )}
    </section>
  );
}
