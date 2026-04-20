"use client";

import { useState, useActionState, useEffect, startTransition } from "react";
import { useFormStatus } from "react-dom";
import { addTransaction } from "../../../lib/transaction";
import { Plus, X, UploadCloud, ArrowDownRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getCloudinarySignature } from "../../../lib/upload";

export default function AddTransaction({ banks }: { banks: { id: string; name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(addTransaction, null);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setAmount("");
      return;
    }
    const formatted = new Intl.NumberFormat("id-ID").format(Number(raw));
    setAmount(formatted);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  async function handleFormSubmit(formData: FormData) {
    const rawAmount = amount.replace(/\D/g, "");
    const file = formData.get("receipt") as File | null;

    formData.set("amount", rawAmount);

    if (file && file.size > 0) {
      setIsUploading(true);
      try {
        const { signature, timestamp, cloudName, apiKey } = await getCloudinarySignature();

        const cloudData = new FormData();
        cloudData.append("file", file);
        cloudData.append("api_key", apiKey!);
        cloudData.append("timestamp", timestamp.toString());
        cloudData.append("signature", signature);
        cloudData.append("folder", "ml_default");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: cloudData }
        );

        const data = await res.json();
        if (data.secure_url) {
          formData.set("noteUrl", data.secure_url);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    formData.delete("receipt")

    startTransition(() => {
    formAction(formData);
    });
  }

  useEffect(() => {
    if (state?.status === "success") {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setAmount("");
        setFileName(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#ff9f1c] text-white rounded-2xl shadow-[0_8px_30px_rgb(255,159,28,0.4)] flex items-center justify-center hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(255,159,28,0.5)] transition-all active:translate-y-0"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Catat Transaksi</h2>

            <form action={handleFormSubmit} className="space-y-5">
              <div className="flex gap-4 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setType("EXPENSE")}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                    type === "EXPENSE"
                      ? "bg-white text-red-500 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setType("INCOME")}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                    type === "INCOME"
                      ? "bg-[#cbf3f0] text-[#2ec4b6] shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <ArrowDownRight size={18} strokeWidth={2.5} />
                  Pemasukan
                </button>
              </div>

              <input type="hidden" name="type" value={type} />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nominal
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    Rp
                  </span>
                  <input
                    name="amount"
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#2ec4b6] focus:border-transparent outline-none font-bold text-gray-800"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Kategori / Keterangan
                </label>
                <input
                  name="category"
                  type="text"
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#2ec4b6] focus:border-transparent outline-none text-gray-800"
                  placeholder="Makan siang, Gaji, dll"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Pilih Bank / Dompet
                </label>
                <select
                  name="bankId"
                  defaultValue=""
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#2ec4b6] focus:border-transparent outline-none text-gray-800 appearance-none bg-white"
                  required
                >
                  <option value="" disabled>Pilih sumber dana</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Upload Nota
                </label>
                <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-colors group cursor-pointer ${fileName ? 'border-[#2ec4b6] bg-[#cbf3f0]/10' : 'border-gray-200 hover:border-[#2ec4b6] hover:bg-[#cbf3f0]/20'}`}>
                  <input
                    type="file"
                    name="receipt"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`flex flex-col items-center justify-center gap-2 ${fileName ? 'text-[#2ec4b6]' : 'text-gray-400 group-hover:text-[#2ec4b6]'}`}>
                    {fileName ? <CheckCircle2 size={28} /> : <UploadCloud size={28} />}
                    <span className="text-sm font-medium text-center px-2 truncate w-full">
                      {fileName ? fileName : "Upload nota (wajib)"}
                    </span>
                  </div>
                </div>
              </div>

              {state?.status === "error" && (
                <p className="text-red-500 text-sm font-medium">{state.message}</p>
              )}
              {state?.status === "success" && (
                <p className="text-[#2ec4b6] text-sm font-medium">{state.message}</p>
              )}

              <SubmitButton type={type} isUploading={isUploading} />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function SubmitButton({ type, isUploading }: { type: "INCOME" | "EXPENSE", isUploading: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || isUploading;

  return (
    <button
      disabled={disabled}
      className={`w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 mt-4 ${
        type === "EXPENSE"
          ? "bg-gray-800 hover:bg-gray-900 shadow-gray-800/30"
          : "bg-[#2ec4b6] hover:bg-[#25a398] shadow-[#2ec4b6]/30"
      }`}
    >
      {isUploading ? "Mengunggah Nota..." : pending ? "Menyimpan..." : "Simpan Transaksi"}
    </button>
  );
}