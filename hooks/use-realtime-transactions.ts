"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/DBsupabase/client";
import { useNotificationStore } from "@/stores/use-notification-store";

interface RealtimeTransactionRow {
  id: string;
  reference: string;
  amount: number;
  type: "credit" | "debit";
  created_at: string;
}

export function useRealtimeTransactions(orgId: string, orgSlug: string) {
  const queryClient = useQueryClient();
  const pushAlert = useNotificationStore((s) => s.pushAlert);

  useEffect(() => {
    if (!orgId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`org-transactions:${orgId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
          filter: `organization_id=eq.${orgId}`,
        },
        (payload) => {
          const row = payload.new as unknown as RealtimeTransactionRow;
          pushAlert({
            id: row.id,
            reference: row.reference,
            amount: row.amount,
            type: row.type,
            timestamp: row.created_at,
          });

          // Invalidate cache safely
          queryClient.invalidateQueries({
            queryKey: ["transactions", orgSlug],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, orgSlug, queryClient, pushAlert]);
}
