"use client";
import { useTransactions } from "@/context/TransactionsContext";

export default function Alerts() {
  const { upcomingTransactions } = useTransactions();

  if (!upcomingTransactions || upcomingTransactions.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-100 dark:bg-red-800 p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-2">Alertas de Vencimento</h2>
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 font-semibold border-b pb-2">
        <span>Descrição (Categoria)</span>
        <span className="text-right">Valor</span>
        <span className="text-right">Data</span>
      </div>
      <ul className="space-y-2 mt-2">
        {upcomingTransactions.map((t) => (
          <li
            key={t.id}
            className="grid grid-cols-[2fr_1fr_1fr] gap-4 border-b py-1"
          >
            <span>{t.descricao} ({t.categoria})</span>
            <span className="text-right font-bold">R$ {t.valor.toFixed(2)}</span>
            <span className="text-right text-sm text-gray-600">{t.data}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
