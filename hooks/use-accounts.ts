import { useQuery } from "@tanstack/react-query";

export interface Account {
  id: string;
  organization_id: string;
  currency: string;
  balance: number | string;
  created_at: string;
}

interface AccountsResponse {
  items: Account[];
}

async function fetchAccounts(orgSlug: string): Promise<AccountsResponse> {
  const response = await fetch(
    `/api/v1/${encodeURIComponent(orgSlug)}/accounts`,
  );
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Unable to load accounts");
  return result;
}

export function useAccounts(orgSlug: string) {
  return useQuery({
    queryKey: ["accounts", orgSlug],
    queryFn: () => fetchAccounts(orgSlug),
    enabled: Boolean(orgSlug),
    staleTime: 30_000,
  });
}
