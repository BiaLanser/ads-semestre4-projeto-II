"use client";
import { useTransactions } from "@/context/TransactionsContext";

export default function BalanceCard() {
  const { transactions } = useTransactions();

  const totalIncome = transactions
    .filter((t) => t.tipo === "receita")
    .reduce((sum, t) => sum + t.valor, 0);

  const totalExpenses = transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((sum, t) => sum + t.valor, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Balanço Geral</h2>
      <p>Receitas: <span className="font-bold">R$ {totalIncome.toFixed(2)}</span></p>
      <p>Despesas: <span className="font-bold">R$ {totalExpenses.toFixed(2)}</span></p>
      <p className="mt-2 font-bold">Saldo: R$ {(totalIncome - totalExpenses).toFixed(2)}</p>
    </div>
  );
}
