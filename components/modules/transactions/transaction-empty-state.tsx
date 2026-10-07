

import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onTriggerTransfer: () => void;
  canCreate: boolean;
}

export function TransactionEmptyState({ onTriggerTransfer, canCreate }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
      <div className="inline-flex items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-full mb-4">
        <ArrowLeftRight className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">No transactions recorded</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
        Your organization has not processed any payouts or debits yet. Initiate your first transfer below.
      </p>
      {canCreate && (
        <div className="mt-6">
          <Button onClick={onTriggerTransfer} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Send First Transfer
          </Button>
        </div>
      )}
    </div>
  );
}