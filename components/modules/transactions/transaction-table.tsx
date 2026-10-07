"use client";

import React from "react";
import { Transaction } from "@/hooks/use-transactions";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface Props {
  data: Transaction[];
  onSortChange: (column: "amount" | "created_at") => void;
  sortColumn?: "amount" | "created_at";
  sortOrder?: "asc" | "desc";
}

export function TransactionTable({
  data,
  onSortChange,
  sortColumn,
  sortOrder,
}: Props) {
  const sortIcon = (column: "amount" | "created_at") => {
    if (sortColumn !== column)
      return <ArrowUpDown aria-hidden="true" className="h-3 w-3" />;
    return sortOrder === "asc" ? (
      <ArrowUp aria-hidden="true" className="h-3 w-3" />
    ) : (
      <ArrowDown aria-hidden="true" className="h-3 w-3" />
    );
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "failed":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "flagged":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs uppercase font-medium text-slate-500 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th scope="col" className="px-6 py-4">
              Reference
            </th>
            <th scope="col" className="px-6 py-4">
              Recipient
            </th>
            <th scope="col" className="px-6 py-4">
              <button
                type="button"
                onClick={() => onSortChange("amount")}
                className="inline-flex items-center gap-1 font-semibold hover:text-slate-950"
                aria-label="Sort by amount"
              >
                Amount {sortIcon("amount")}
              </button>
            </th>
            <th scope="col" className="px-6 py-4">
              Status
            </th>
            <th scope="col" className="px-6 py-4">
              <button
                type="button"
                onClick={() => onSortChange("created_at")}
                className="inline-flex items-center gap-1 font-semibold hover:text-slate-950"
                aria-label="Sort by date"
              >
                Date {sortIcon("created_at")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((txn) => (
            <tr
              key={txn.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td className="px-6 py-4 font-mono text-xs">{txn.reference}</td>
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                {txn.recipient_name}
                <div className="text-xs font-normal text-slate-400">
                  {txn.recipient_account}
                </div>
              </td>
              <td className="px-6 py-4 font-semibold">
                <span
                  className={
                    txn.type === "credit"
                      ? "text-emerald-600"
                      : "text-slate-900 dark:text-slate-100"
                  }
                >
                  {txn.type === "credit" ? "+" : "-"}$
                  {Number(txn.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </td>
              <td className="px-6 py-4">
                <Badge
                  variant="outline"
                  className={`capitalize ${getStatusColor(txn.status)}`}
                >
                  {txn.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-xs text-slate-400">
                {new Date(txn.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
