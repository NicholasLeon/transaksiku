import { z } from "zod";

export const actionResponseSchema = z.object({
  status: z.enum(["success", "error"]),
  message: z.string(),
}).nullable();

export type ActionResponse = z.infer<typeof actionResponseSchema>;