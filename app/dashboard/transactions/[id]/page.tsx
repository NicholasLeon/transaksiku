import { notFound } from "next/navigation";
import { getTransactionDetail } from "../../../../lib/transaction";
import { TransactionDetailView } from "./components/transactionDetail";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const data = await getTransactionDetail(id);

  if (!data) return notFound();

  return <TransactionDetailView data={data} />;
}