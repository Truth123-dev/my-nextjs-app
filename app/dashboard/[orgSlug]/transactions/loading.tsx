import { TransactionTableSkeleton } from "@/components/modules/transactions/transaction-table-skeleton";

export default function LoadingTransactions() {
  return <div className="space-y-5"><div className="h-8 w-48 animate-pulse rounded bg-slate-200" /><TransactionTableSkeleton /></div>;
}
