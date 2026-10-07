

import { Skeleton } from "@/components/ui/skeleton";

export function TransactionTableSkeleton() {
  return (
    <div className="w-full space-y-3" role="status" aria-label="Loading transactions">
      <div className="flex justify-between items-center py-2">
        <Skeleton className="h-10 w-72 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="h-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border-b border-slate-100 dark:border-slate-800">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}