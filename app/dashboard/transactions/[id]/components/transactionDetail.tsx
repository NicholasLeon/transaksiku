import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Wallet, FileText, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface DetailProps {
  data: {
    transaction: any;
    bankName: string;
  };
}

export function TransactionDetailView({ data }: DetailProps) {
  const { transaction, bankName } = data;
  const isIncome = transaction.type === "INCOME";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-[#2ec4b6] transition-colors mb-6 w-fit font-semibold text-sm">
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>Kembali ke Dashboard</span>
        </Link>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className={`p-8 sm:p-10 text-center flex flex-col items-center border-b border-gray-50 ${isIncome ? 'bg-[#cbf3f0]/20' : 'bg-red-50/30'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${isIncome ? 'bg-[#cbf3f0] text-[#2ec4b6]' : 'bg-red-100 text-red-500'}`}>
              {isIncome ? <ArrowDownRight size={28} strokeWidth={2.5} /> : <ArrowUpRight size={28} strokeWidth={2.5} />}
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
              {isIncome ? 'Pemasukan' : 'Pengeluaran'}
            </p>
            <h1 className={`text-4xl sm:text-5xl font-black tracking-tight ${isIncome ? 'text-[#2ec4b6]' : 'text-gray-800'}`}>
              {isIncome ? "+" : "-"} Rp {new Intl.NumberFormat("id-ID").format(transaction.amount)}
            </h1>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InfoBox icon={<Tag size={20} />} label="Kategori" value={transaction.category} />
              <InfoBox icon={<Wallet size={20} />} label="Sumber Dana" value={bankName} />
              <InfoBox 
                icon={<Calendar size={20} />} 
                label="Tanggal" 
                value={new Date(transaction.date).toLocaleDateString('id-ID', { dateStyle: 'long' })} 
              />
              <InfoBox icon={<FileText size={20} />} label="Keterangan" value={transaction.description || "-"} />
            </div>

            {transaction.noteUrl && (
              <div className="pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#cbf3f0]/30 flex items-center justify-center text-[#2ec4b6]">
                    <FileText size={20} strokeWidth={2.5} />
                  </div>
                  <label className="text-base font-bold text-gray-800">Bukti Nota</label>
                </div>
                <div className="relative aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden border-2 border-gray-50 bg-gray-50/50 group cursor-pointer">
                  <Image 
                    src={transaction.noteUrl} 
                    sizes="(max-width: 768px) 100vw, 672px" 
                    alt="Nota" 
                    fill 
                    className="object-contain p-2" 
                  />
                  <a 
                    href={transaction.noteUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold text-sm rounded-3xl"
                  >
                    Lihat Gambar Penuh
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-gray-50/50 border border-gray-50">
      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="font-bold text-gray-800 text-base">{value}</p>
      </div>
    </div>
  );
}