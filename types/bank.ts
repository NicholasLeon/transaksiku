import { z } from "zod";

export const bankInputSchema = z.object({
  name: z.string().min(1, "Nama bank wajib diisi"),
  balance: z.number().nonnegative("Saldo tidak boleh negatif"),
});

export type BankInput = z.infer<typeof bankInputSchema>;