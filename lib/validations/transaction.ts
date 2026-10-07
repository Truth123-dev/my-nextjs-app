


import { z } from 'zod';

export const CreateTransferSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().positive({ message: "Amount must be greater than zero." }),
  recipientName: z.string().min(2, { message: "Recipient name is required." }),
  recipientAccount: z.string().min(8, { message: "Valid account details required." }),
  description: z.string().max(140).optional(),
});

export const QueryTransactionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(10).max(100).default(25),
  search: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed', 'flagged']).optional(),
  sort: z.enum(['created_at', 'amount']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateTransferInput = z.infer<typeof CreateTransferSchema>;
export type QueryTransactionsInput = z.infer<typeof QueryTransactionsSchema>;