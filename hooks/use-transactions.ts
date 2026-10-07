import { useQuery } from "@tanstack/react-query";
import { QueryTransactionsInput } from "@/lib/validations/transaction";

export interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  status: "pending" | "completed" | "failed" | "flagged";
  reference: string;
  recipient_name: string;
  recipient_account: string;
  created_at: string;
}

interface TransactionsResponse {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
}

async function fetchTransactions(
  orgSlug: string,
  params: QueryTransactionsInput,
): Promise<TransactionsResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    sort: params.sort,
    order: params.order,
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
  });

  const response = await fetch(
    `/api/v1/${orgSlug}/transactions?${searchParams.toString()}`,
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error ?? "Failed to fetch transactions");
  }
  return result;
}

export function useTransactions(
  orgSlug: string,
  queryParams: QueryTransactionsInput,
) {
  return useQuery({
    queryKey: ["transactions", orgSlug, queryParams],
    queryFn: () => fetchTransactions(orgSlug, queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    retry: 2,
  });
}
