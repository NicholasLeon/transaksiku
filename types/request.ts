import { z } from "zod";

export const requestSchema = z.object({
  name: z.string().min(2, "Nama tujuan minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  amount: z.string().refine((val) => {
    const num = Number(val.replace(/\D/g, ""));
    return num > 0;
  }, "Nominal harus lebih dari 0"),
  description: z.string().min(5, "Keterangan minimal 5 karakter"),
});

export type RequestInput = z.infer<typeof requestSchema>;

export type RequestState = {
  status: "success" | "error" | "idle";
  message: string;
  errors?: {
    [K in keyof RequestInput]?: string[];
  };
} | null;