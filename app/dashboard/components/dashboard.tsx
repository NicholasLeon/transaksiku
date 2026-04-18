import { getDashboardData } from "../../../lib/dashboard";
import { Receipt, ArrowUpRight, ArrowDownRight, Wallet, ChevronRight } from "lucide-react";
import Link from "next/link";
import AddBank from "./addbank";
import AddTransaction from "./addTransaction";
import UserMenu from "./userMenu";

export default async function DashboardPage() {
  const { user, userBanks, recentTransactions } = await getDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-[#2ec4b6] pt-8 pb-20 px-4 sm:px-6 text-white rounded-b-[2rem] sm:rounded-b-[2.5rem] shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[#cbf3f0] text-sm font-medium">Selamat datang kembali,</p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{user.name}</h2>
          </div>
          
          <UserMenu initial={user.name.charAt(0).toUpperCase()} />

        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 space-y-6 sm:space-y-8">
        <section>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 sm:pb-6 no-scrollbar snap-x">
            {userBanks.map((bank) => (
              <div
                key={bank.id}
                className="snap-start min-w-[85vw] sm:min-w-[280px] bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div className="w-10 h-10 bg-[#cbf3f0] rounded-full flex items-center justify-center text-[#2ec4b6]">
                    <Wallet size={20} strokeWidth={2.5} />
                  </div>
                  <p className="text-sm font-medium text-gray-400">{bank.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Saldo</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                    Rp {bank.balance.toLocaleString("id-ID")}
                  </h3>
                </div>
              </div>
            ))}

            <AddBank />
          </div>
        </section>

        <section className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">Riwayat Transaksi</h3>
            <Link href="/dashboard/transactionslist" className="text-[#2ec4b6] text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity">
            <button className="text-[#2ec4b6] text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity">
              Lihat Semua <ChevronRight size={16} />
            </button>
            </Link>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {recentTransactions.map((tx) => {
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
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <AddTransaction banks={userBanks} />
    </div>
  );
}