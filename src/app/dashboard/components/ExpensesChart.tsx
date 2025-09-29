"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTransactions } from "@/context/TransactionsContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesChart() {
  const { transactions } = useTransactions();

  const despesas = transactions.filter((t) => t.tipo === "despesa");
  const categorias = Array.from(new Set(despesas.map((d) => d.categoria)));

  const data = {
    labels: categorias,
    datasets: [
      {
        label: "Despesas",
        data: categorias.map((c) =>
          despesas.filter((d) => d.categoria === c).reduce((sum, t) => sum + t.valor, 0)
        ),
        backgroundColor: ["#34D399", "#60A5FA", "#FBBF24", "#F87171", "#A78BFA", "#F472B6"],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Distribuição de Despesas</h2>
      <Pie data={data} />
    </div>
  );
}
