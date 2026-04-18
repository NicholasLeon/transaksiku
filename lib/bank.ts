"use server";

import { db } from "@/db";
import { banks } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types/action";
import { cookies } from "next/headers";

export async function addBank(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = formData.get("name") as string;
    const balance = Number(formData.get("balance"));

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

    if (!name || name.trim() === "") {
      return { status: "error", message: "Nama bank wajib diisi" };
    }

    if (isNaN(balance) || balance < 0) {
      return { status: "error", message: "Saldo awal tidak valid" };
    }

    await db.insert(banks).values({
      userId,
      name: name.trim(),
      balance,
    });

    revalidatePath("/dashboard");

    return { status: "success", message: "Bank berhasil ditambahkan!" };
  } catch (error) {
    return { status: "error", message: "Gagal menyimpan data bank" };
  }
}