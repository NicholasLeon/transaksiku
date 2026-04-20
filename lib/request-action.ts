"use server";

import { db } from "@/db";
import { moneyRequests } from "@/db/schema";
import { sendRequestEmail } from "./mail";
import { revalidatePath } from "next/cache";
import { requestSchema, RequestState } from "@/types/request";

export async function submitMoneyRequest(
  userId: string,
  prevState: RequestState,
  formData: FormData
): Promise<RequestState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    amount: formData.get("amount"),
    description: formData.get("description"),
  };

  const validatedFields = requestSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Validasi gagal, periksa kembali inputan Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, amount: amountStr, description } = validatedFields.data;
  const amount = Number(amountStr.replace(/\D/g, ""));

  try {
    await db.insert(moneyRequests).values({
      userId,
      targetName: name,
      targetContact: email,
      amount,
      description,
    });

    await sendRequestEmail(email, { name, amount, description });

    revalidatePath("/dashboard");
    return { 
      status: "success", 
      message: "Permintaan dana berhasil dikirim ke email!" 
    };
  } catch (error) {
    console.error("Request Error:", error);
    return { 
      status: "error", 
      message: "Terjadi kesalahan pada server." 
    };
  }
}