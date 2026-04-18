import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, banks, transactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getDashboardData() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    redirect("/login");
  }

  const session = JSON.parse(sessionCookie.value);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.id));

  if (!user) {
    redirect("/");
  }

  const userBanks = await db
    .select()
    .from(banks)
    .where(eq(banks.userId, user.id));

  const recentTransactions = await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      type: transactions.type,
      category: transactions.category,
      date: transactions.date,
      noteUrl: transactions.noteUrl,
      bank: {
        id: banks.id,
        name: banks.name,
      },
    })
    .from(transactions)
    .leftJoin(banks, eq(transactions.bankId, banks.id))
    .where(eq(transactions.userId, user.id))
    .orderBy(desc(transactions.date))
    .limit(5);

  return {
    user,
    userBanks,
    recentTransactions,
  };
}

export async function getAllTransactions() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    redirect("/")
  }

  const session = JSON.parse(sessionCookie.value);

  const allTransaction = await db.select({
    id: transactions.id,
    amount: transactions.amount,
    type: transactions.type,
    category: transactions.category,
    date: transactions.date,
    noteUrl: transactions.noteUrl,
    bank: {
      id: banks.id,
      name: banks.name,
    },
  })
  .from(transactions)
  .leftJoin(banks, eq(transactions.bankId, banks.id))
  .where(eq(transactions.userId, session.id))
  .orderBy(desc(transactions.date));

  return allTransaction;
}