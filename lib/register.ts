"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/types/user";
import { redirect } from "next/navigation";

type RegisterState =
  | { status: "error"; message: string }
  | { status: "success" }
  | null;

export async function register(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  try {
    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.issues[0]?.message || "Input tidak valid",
      };
    }

    const { name, email, password } = parsed.data;

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length > 0) {
      return {
        status: "error",
        message: "Email sudah terdaftar",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

  } catch (err) {
    console.error(err);
    return {
      status: "error",
      message: "Terjadi kesalahan pada server",
    };
  }

  redirect("/");
}