"use server";

import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/types/user";
import { redirect } from "next/navigation";

type LoginState =
  | { status: "error"; message: string }
  | { status: "success" }
  | null;

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0].message,
    };
  }

  const { email, password } = parsed.data;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return { status: "error", message: "Email tidak ditemukan" };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { status: "error", message: "Password salah" };
  }

  const cookieStore = await cookies();

  cookieStore.set("session", JSON.stringify({
    id: user.id,
    email: user.email,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  redirect("/dashboard");
}