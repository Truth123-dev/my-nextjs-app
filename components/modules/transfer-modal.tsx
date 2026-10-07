"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTransferSchema,
  CreateTransferInput,
} from "@/lib/validations/transaction";
import { useCreateTransfer } from "@/hooks/use-create-transfer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  orgSlug: string;
  accountId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ orgSlug, accountId, isOpen, onClose }: Props) {
  const {
    mutate: executeTransfer,
    isPending,
    error,
  } = useCreateTransfer(orgSlug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTransferInput>({
    resolver: zodResolver(CreateTransferSchema),
    defaultValues: {
      accountId,
      amount: 0,
      recipientName: "",
      recipientAccount: "",
    },
  });

  const onSubmit = (values: CreateTransferInput) => {
    executeTransfer(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Transfer</DialogTitle>
          <DialogDescription>
            Records a debit in this ledger; it does not send money to a bank.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <input type="hidden" {...register("accountId")} value={accountId} />
          {error && (
            <p role="alert" className="text-sm text-rose-600">
              {error.message}
            </p>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Recipient Name
            </label>
            <Input
              {...register("recipientName")}
              placeholder="Acme Logistics LLC"
            />
            {errors.recipientName && (
              <p className="text-xs text-rose-500">
                {errors.recipientName.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Recipient Account Number / IBAN
            </label>
            <Input
              {...register("recipientAccount")}
              placeholder="US89370400440532013000"
            />
            {errors.recipientAccount && (
              <p className="text-xs text-rose-500">
                {errors.recipientAccount.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Amount (USD)
            </label>
            <Input
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
              placeholder="1250.00"
            />
            {errors.amount && (
              <p className="text-xs text-rose-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description (optional)
            </label>
            <Input
              maxLength={140}
              {...register("description")}
              placeholder="Invoice or payment note"
            />
            {errors.description && (
              <p className="text-xs text-rose-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isPending ? "Recording…" : "Record transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
