"use client";

import { useActionState } from "react";
import { register } from "../../../lib/register";
import { useFormStatus } from "react-dom";

export default function RegisterForm() {
  const [state, formAction] = useActionState(register, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lengkap
        </label>
        <input
          name="name"
          type="text"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2ec4b6] outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2ec4b6] outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2ec4b6] outline-none"
          required
        />
      </div>

      {state?.status === "error" && (
        <p className="text-red-500 text-sm">
          {state.message}
        </p>
      )}

      {state?.status === "success" && (
        <p className="text-[#2ec4b6] text-sm font-medium">
          Pendaftaran berhasil! Silakan login.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="w-full bg-[#2ec4b6] hover:bg-[#25a398] text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50"
    >
      {pending ? "Memproses..." : "Daftar Sekarang"}
    </button>
  );
}