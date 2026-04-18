import { pgTable, uuid, text, doublePrecision, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const transactionType = pgEnum("type", ["INCOME", "EXPENSE"]);

export const userRole = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRole("role").default("USER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const banks = pgTable("banks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  balance: doublePrecision("balance").default(0).notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  bankId: uuid("bank_id").references(() => banks.id, { onDelete: "cascade" }).notNull(),
  amount: doublePrecision("amount").notNull(),
  type: transactionType("type").notNull(),
  category: text("category").notNull(),
  noteUrl: text("note_url"),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  banks: many(banks),
  transactions: many(transactions),
}));

export const banksRelations = relations(banks, ({ one, many }) => ({
  user: one(users, { fields: [banks.userId], references: [users.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  bank: one(banks, { fields: [transactions.bankId], references: [banks.id] }),
}));