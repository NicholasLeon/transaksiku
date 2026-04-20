"use client";
import { useActionState } from "react";
import { submitMoneyRequest } from "@/lib/request-action";
import { SendHorizontal } from "lucide-react";

export default function RequestForm({ userId }: { userId: string }) {
  const submitWithId = submitMoneyRequest.bind(null, userId);
  const [state, formAction, isPending] = useActionState(submitWithId, null);

  return (
    <form action={formAction} className="space-y-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 text-lg">Request Dana</h3>
      
      <div className="space-y-3">
        <input 
          name="email" 
          type="email"
          placeholder="Email Tujuan" 
          className="w-full p-3 rounded-xl bg-gray-50 border-none outline-[#2ec4b6] text-sm"
          required 
        />
        <div className="flex gap-2">
          <input 
            name="amount" 
            placeholder="Nominal" 
            className="flex-1 p-3 rounded-xl bg-gray-50 border-none outline-[#2ec4b6] text-sm font-bold"
            required 
          />
          <button className="bg-[#2ec4b6] text-white p-3 rounded-xl hover:scale-105 transition-transform">
            <SendHorizontal size={20} />
          </button>
        </div>
        <textarea 
          name="description" 
          placeholder="Keperluan " 
          className="w-full p-3 rounded-xl bg-gray-50 border-none outline-[#2ec4b6] text-sm h-20"
        />
      </div>
    </form>
  );
}