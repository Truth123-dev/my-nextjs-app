import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransferInput } from "@/lib/validations/transaction";
import { Transaction } from "./use-transactions";

export function useCreateTransfer(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTransferInput) => {
      const res = await fetch(`/api/v1/${orgSlug}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Transfer failed");
      }
      return result;
    },
    // Optimistic UI updates
    onMutate: async (newTransfer) => {
      await queryClient.cancelQueries({ queryKey: ["transactions", orgSlug] });
      const queryKeyPrefix = ["transactions", orgSlug];
      const previousSnapshots =
        queryClient.getQueriesData<TransactionsResponse>({
          queryKey: queryKeyPrefix,
        });

      const optimisticTx: Transaction = {
        id: `temp-${Date.now()}`,
        amount: newTransfer.amount,
        type: "debit",
        status: "pending",
        reference: `OPT-${Date.now()}`,
        recipient_name: newTransfer.recipientName,
        recipient_account: newTransfer.recipientAccount,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueriesData<TransactionsResponse>(
        { queryKey: queryKeyPrefix },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            total: old.total + 1,
            items: [optimisticTx, ...old.items],
          };
        },
      );

      return { previousSnapshots };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSnapshots) {
        context.previousSnapshots.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", orgSlug] });
    },
  });
}

interface TransactionsResponse {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
}
