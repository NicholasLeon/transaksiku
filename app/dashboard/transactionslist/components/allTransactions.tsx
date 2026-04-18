import { getAllTransactions } from "@/lib/dashboard";
import { ArrowLeft, ArrowDownRight, ArrowUpRight, Receipt } from "lucide-react";
import Link from "next/link";
import { TransactionRecord } from "@/types/transactions";

export default async function AllTransactionsPage() {
  const transactions = await getAllTransactions();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/dashboard" 
            className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#2ec4b6] hover:border-[#cbf3f0] transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Semua Transaksi</h1>
            <p className="text-sm font-medium text-gray-500">Riwayat lengkap aktivitas keuanganmu</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-medium">Belum ada transaksi yang dicatat.</p>
              </div>
            ) : (
              transactions.map((tx: TransactionRecord) => {
                const isIncome = tx.type === "INCOME";

                return (
                  <Link
                    key={tx.id}
                    href={`/dashboard/transactions/${tx.id}`}
                    className="group flex items-center justify-between p-3 sm:p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm ${
                          isIncome ? "bg-[#cbf3f0] text-[#2ec4b6]" : "bg-red-50 text-red-500"
                        }`}
                      >
                        {isIncome ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1">{tx.category}</p>
                        <p className="text-xs text-gray-500 font-medium">{tx.bank?.name}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p
                        className={`font-bold text-sm sm:text-base ${
                          isIncome ? "text-[#2ec4b6]" : "text-gray-800"
                        }`}
                      >
                        {isIncome ? "+" : "-"} Rp {tx.amount.toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        {!isIncome && tx.noteUrl && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] sm:text-xs font-semibold">
                            <Receipt size={12} />
                            Nota
                          </div>
                        )}
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                          {tx.date.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}