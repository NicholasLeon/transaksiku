"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X, Landmark, Wallet } from "lucide-react";
import { addBank } from "@/lib/bank";

export default function AddBank() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(addBank, null);
  const [balance, setBalance] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setBalance("");
      return;
    }
    const formatted = new Intl.NumberFormat("id-ID").format(Number(raw));
    setBalance(formatted);
  }

  function handleFormSubmit(formData: FormData) {
    const rawBalance = balance.replace(/\D/g, "");
    formData.set("balance", rawBalance);
    formAction(formData);
  }

  useEffect(() => {
    if (state?.status === "success") {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setBalance("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="snap-start min-w-[120px] bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:text-[#2ec4b6] hover:border-[#2ec4b6] hover:bg-[#cbf3f0]/30 transition-all gap-2"
      >
        <Plus size={24} />
        <span className="text-sm font-medium">Bank</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-sm bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#cbf3f0] rounded-2xl flex items-center justify-center text-[#2ec4b6]">
                <Landmark size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Tambah Bank</h2>
                <p className="text-sm text-gray-500 font-medium">Buat dompet baru</p>
              </div>
            </div>

            <form action={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nama Bank / Dompet
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Wallet size={18} />
                  </span>
                  <input
                    name="name"
                    type="text"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#2ec4b6] focus:border-transparent outline-none text-gray-800"
                    placeholder="BCA, Mandiri, Gopay..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Saldo Awal
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    Rp
                  </span>
                  
                  <input
                    name="balance"
                    type="text"
                    inputMode="numeric"
                    value={balance}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#2ec4b6] focus:border-transparent outline-none font-bold text-gray-800"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {state?.status === "error" && (
                <p className="text-red-500 text-sm font-medium px-1">{state.message}</p>
              )}

              {state?.status === "success" && (
                <p className="text-[#2ec4b6] text-sm font-medium px-1">{state.message}</p>
              )}

              <SubmitButton />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="w-full mt-4 bg-[#2ec4b6] hover:bg-[#25a398] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#2ec4b6]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
    >
      {pending ? "Menyimpan..." : "Simpan Bank"}
    </button>
  );
}