import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Transaction } from "@/hooks/use-transactions";

interface TransactionFiltersProps {
  search: string;
  status: Transaction["status"] | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: Transaction["status"] | undefined) => void;
}

export function TransactionFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block w-full sm:max-w-sm">
        <span className="sr-only">Search transactions</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search reference or recipient"
          className="pl-9"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <span>Status</span>
        <select
          value={status ?? ""}
          onChange={(event) =>
            onStatusChange(
              event.target.value
                ? (event.target.value as Transaction["status"])
                : undefined,
            )
          }
          className="h-10 min-w-36 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="flagged">Flagged</option>
        </select>
      </label>
    </div>
  );
}
