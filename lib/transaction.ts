"use server";

import { db } from "@/db";
import { transactions, banks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../types/action";
import { cookies } from "next/headers";

export async function addTransaction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const type = formData.get("type") as "INCOME" | "EXPENSE";
    const amount = Number(formData.get("amount"));
    const category = formData.get("category") as string;
    const bankId = formData.get("bankId") as string;
    const noteUrl = formData.get("noteUrl") as string | null;
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return { status: "error", message: "Sesi tidak valid, silakan login ulang" };
    }

    const session = JSON.parse(sessionCookie.value);
    const userId = session.id;

    if (!userId) {
      return { status: "error", message: "User tidak valid" };
    }

    if (!amount || amount <= 0 || !category || !bankId) {
      return { status: "error", message: "Semua kolom wajib diisi" };
    }

    await db.transaction(async (tx) => {
      await tx.insert(transactions).values({
        userId,
        bankId,
        amount,
        type,
        category,
        noteUrl: noteUrl,
      });

      const balanceModifier = type === "INCOME" ? amount : -amount;

      await tx
        .update(banks)
        .set({ balance: sql`${banks.balance} + ${balanceModifier}` })
        .where(eq(banks.id, bankId));
    });

    revalidatePath("/dashboard");
    
    return { status: "success", message: "Transaksi berhasil dicatat!" };
  } catch (error) {
    return { status: "error", message: "Gagal menyimpan transaksi" };
  }
}

export async function getTransactionDetail(id: string) {
  return await db
    .select({
      transaction: transactions,
      bankName: banks.name,
    })
    .from(transactions)
    .innerJoin(banks, eq(transactions.bankId, banks.id))
    .where(eq(transactions.id, id))
    .then((res) => res[0]);
}