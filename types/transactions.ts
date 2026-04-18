import { z } from "zod";

export const TransactionRecordSchema = z.object({
  id: z.string(),
  type: z.string(),
  category: z.string(),
  amount: z.number(),
  date: z.date(),
  noteUrl: z.string().nullable(),
  bank: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
});

export type TransactionRecord = z.infer<typeof TransactionRecordSchema>;